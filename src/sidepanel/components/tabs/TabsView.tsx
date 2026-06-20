import { useEffect, useState } from 'react';
import {
    groupByDomain,
    groupByTimeBucket,
    groupByWindow,
    type LiveTab,
    queryAllTabs,
} from '../../../lib/tabs';
import { useLibraryStore } from '../../../store/useLibraryStore';
import ImportBar from './ImportBar';
import TabCard from './TabCard';
import styles from './TabsView.module.css';

type GroupBy = 'window' | 'domain' | 'time';

function TabsView() {
    const { groups, addNote } = useLibraryStore();
    const [tabs, setTabs] = useState<LiveTab[]>([]);
    const [groupBy, setGroupBy] = useState<GroupBy>('window');
    const [selectedTabIds, setSelectedTabIds] = useState<Set<number>>(
        new Set(),
    );
    const [targetGroupId, setTargetGroupId] = useState('');

    useEffect(() => {
        queryAllTabs().then(setTabs);
    }, []);

    const toggleTab = (tabId: number) => {
        setSelectedTabIds((prev) => {
            const next = new Set(prev);
            if (next.has(tabId)) {
                next.delete(tabId);
            } else {
                next.add(tabId);
            }
            return next;
        });
    };

    const handleSelectAllCurrentWindow = async () => {
        const currentWindow = await chrome.windows.getCurrent();
        const ids = tabs
            .filter((tab) => tab.windowId === currentWindow.id)
            .map((tab) => tab.id);
        setSelectedTabIds(new Set(ids));
    };

    const handleSelectAllWindows = () => {
        setSelectedTabIds(new Set(tabs.map((tab) => tab.id)));
    };

    // 선택된 탭들을 `.addNote()`로 library에 가져오는 로직
    // 조건: `targetGroupId`가 설정되어 있고, 선택된 탭이 하나라도 있어야 실행
    const handleImport = async () => {
        if (!targetGroupId || selectedTabIds.size === 0) return;
        const selectedTabs = tabs.filter((tab) => selectedTabIds.has(tab.id));
        for (const tab of selectedTabs) {
            await addNote({
                groupId: targetGroupId,
                url: tab.url,
                title: tab.title,
                favicon: tab.favIconUrl,
                tagIds: [],
            });
        }
        setSelectedTabIds(new Set());
    };

    const groupedTabs =
        groupBy === 'window'
            ? groupByWindow(tabs)
            : groupBy === 'domain'
              ? groupByDomain(tabs)
              : groupByTimeBucket(tabs);

    return (
        <div className={styles.container}>
            <div className={styles.toggleBar}>
                <button
                    type="button"
                    className={groupBy === 'window' ? styles.toggleActive : ''}
                    onClick={() => setGroupBy('window')}
                >
                    윈도우별
                </button>
                <button
                    type="button"
                    className={groupBy === 'domain' ? styles.toggleActive : ''}
                    onClick={() => setGroupBy('domain')}
                >
                    도메인별
                </button>
                <button
                    type="button"
                    className={groupBy === 'time' ? styles.toggleActive : ''}
                    onClick={() => setGroupBy('time')}
                >
                    시간대별
                </button>
            </div>
            <ImportBar
                groups={groups}
                selectedGroupId={targetGroupId}
                onSelectGroupId={setTargetGroupId}
                selectedCount={selectedTabIds.size}
                onImport={handleImport}
                onSelectAllCurrentWindow={handleSelectAllCurrentWindow}
                onSelectAllWindows={handleSelectAllWindows}
            />
            <div className={styles.list}>
                {tabs.length === 0 ? (
                    <p className={styles.empty}>열린 탭이 없습니다.</p>
                ) : (
                    groupedTabs.map((group) => (
                        <div key={group.label}>
                            <div className={styles.sectionLabel}>
                                {group.label}
                            </div>
                            {group.tabs.map((tab) => (
                                <TabCard
                                    key={tab.id}
                                    tab={tab}
                                    checked={selectedTabIds.has(tab.id)}
                                    onToggle={toggleTab}
                                />
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default TabsView;
