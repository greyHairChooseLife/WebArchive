import { useState } from 'react';
import { useLibraryStore } from '../../../store/useLibraryStore';
import GroupList from './GroupList';
import styles from './LibraryView.module.css';
import NoteDetail from './NoteDetail';
import NoteList from './NoteList';
import TagFilter from './TagFilter';
import TagManager from './TagManager';

function LibraryView() {
    const { groups, tags, notes } = useLibraryStore();
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
        groups[0]?.id ?? null,
    );
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [scopeToGroup, setScopeToGroup] = useState(false);

    const effectiveGroupId =
        selectedGroupId && groups.some((g) => g.id === selectedGroupId)
            ? selectedGroupId
            : (groups[0]?.id ?? null);

    const filteredNotes = notes.filter((note) => {
        if (selectedTagId && !note.tagIds.includes(selectedTagId)) {
            return false;
        }
        if (scopeToGroup || !selectedTagId) {
            return note.groupId === effectiveGroupId;
        }
        return true;
    });

    const selectedNote = notes.find((n) => n.id === selectedNoteId) ?? null;

    return (
        <div className={styles.container}>
            {/* 상단: 그룹 큰 버튼 가로 나열 */}
            <GroupList
                groups={groups}
                selectedGroupId={effectiveGroupId}
                onSelectGroup={(groupId) => {
                    setSelectedGroupId(groupId);
                    setSelectedNoteId(null);
                }}
            />
            <div className={styles.body}>
                {/* 좌측: 태그 필터 + 태그 관리 */}
                <div className={styles.sidebar}>
                    <TagFilter
                        tags={tags}
                        selectedTagId={selectedTagId}
                        onSelectTag={setSelectedTagId}
                        scopeToGroup={scopeToGroup}
                        onScopeToGroupChange={setScopeToGroup}
                    />
                    <TagManager tags={tags} />
                </div>
                {/* 우측: 상세(목록 위) + 노트 목록 */}
                <div className={styles.main}>
                    {selectedNote ? (
                        <NoteDetail
                            note={selectedNote}
                            tags={tags}
                            onClose={() => setSelectedNoteId(null)}
                        />
                    ) : null}
                    {effectiveGroupId ? (
                        <NoteList
                            notes={filteredNotes}
                            groupId={effectiveGroupId}
                            selectedNoteId={selectedNoteId}
                            onSelectNote={setSelectedNoteId}
                        />
                    ) : (
                        <p className={styles.empty}>
                            group을 먼저 추가해주세요.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LibraryView;
