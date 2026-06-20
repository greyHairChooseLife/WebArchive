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
            <div className={styles.sidebar}>
                <GroupList
                    groups={groups}
                    selectedGroupId={effectiveGroupId}
                    onSelectGroup={(groupId) => {
                        setSelectedGroupId(groupId);
                        setSelectedNoteId(null);
                    }}
                />
                <TagManager tags={tags} />
            </div>
            <div className={styles.main}>
                <TagFilter
                    tags={tags}
                    selectedTagId={selectedTagId}
                    onSelectTag={setSelectedTagId}
                    scopeToGroup={scopeToGroup}
                    onScopeToGroupChange={setScopeToGroup}
                />
                {effectiveGroupId ? (
                    <NoteList
                        notes={filteredNotes}
                        groupId={effectiveGroupId}
                        selectedNoteId={selectedNoteId}
                        onSelectNote={setSelectedNoteId}
                    />
                ) : (
                    <p className={styles.empty}>group을 먼저 추가해주세요.</p>
                )}
            </div>
            {selectedNote ? (
                <NoteDetail
                    note={selectedNote}
                    tags={tags}
                    onClose={() => setSelectedNoteId(null)}
                />
            ) : null}
        </div>
    );
}

export default LibraryView;
