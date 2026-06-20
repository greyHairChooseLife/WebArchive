import { useLibraryStore } from '../../../store/useLibraryStore';
import type { Group } from '../../../types/entities';
import styles from './ImportBar.module.css';

const NEW_GROUP_OPTION = '__new__';

type ImportBarProps = {
    groups: Group[];
    selectedGroupId: string;
    onSelectGroupId: (groupId: string) => void;
    selectedCount: number;
    onImport: () => void;
    onSelectAllCurrentWindow: () => void;
    onSelectAllWindows: () => void;
};

function ImportBar({
    groups,
    selectedGroupId,
    onSelectGroupId,
    selectedCount,
    onImport,
    onSelectAllCurrentWindow,
    onSelectAllWindows,
}: ImportBarProps) {
    const { addGroup } = useLibraryStore();

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== NEW_GROUP_OPTION) {
            onSelectGroupId(e.target.value);
            return;
        }
        const name = prompt('새 group 이름')?.trim();
        if (!name) return;
        await addGroup(name);
        const created = useLibraryStore
            .getState()
            .groups.find((g) => g.name === name);
        if (created) onSelectGroupId(created.id);
    };

    return (
        <div className={styles.container}>
            <span className={styles.count}>선택 {selectedCount}개</span>
            <select value={selectedGroupId} onChange={handleChange}>
                <option value="" disabled>
                    대상 group 선택
                </option>
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
                <option value={NEW_GROUP_OPTION}>+ 새 group</option>
            </select>
            <button
                type="button"
                disabled={selectedCount === 0 || !selectedGroupId}
                onClick={onImport}
            >
                가져오기
            </button>
            <button type="button" onClick={onSelectAllCurrentWindow}>
                현재 윈도우 전체
            </button>
            <button type="button" onClick={onSelectAllWindows}>
                모든 윈도우 전체
            </button>
        </div>
    );
}

export default ImportBar;
