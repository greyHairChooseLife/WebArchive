import { useState } from 'react';
import { useLibraryStore } from '../../../store/useLibraryStore';
import type { Group } from '../../../types/entities';
import styles from './GroupList.module.css';

type GroupListProps = {
    groups: Group[];
    selectedGroupId: string | null;
    onSelectGroup: (groupId: string) => void;
};

function GroupList({ groups, selectedGroupId, onSelectGroup }: GroupListProps) {
    const { addGroup, updateGroup, deleteGroup } = useLibraryStore();
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = newName.trim();
        if (!name) return;
        await addGroup(name);
        setNewName('');
    };

    const startEdit = (group: Group) => {
        setEditingId(group.id);
        setEditingName(group.name);
    };

    const commitEdit = async () => {
        const name = editingName.trim();
        if (editingId && name) {
            await updateGroup(editingId, name);
        }
        setEditingId(null);
    };

    const handleDelete = async (group: Group) => {
        const noteCount = useLibraryStore
            .getState()
            .notes.filter((n) => n.groupId === group.id).length;
        const confirmed = confirm(
            `"${group.name}" group을 삭제하면 하위 note ${noteCount}개도 함께 삭제됩니다. 계속하시겠습니까?`,
        );
        if (!confirmed) return;
        await deleteGroup(group.id);
    };

    return (
        <div className={styles.container}>
            {groups.map((group) =>
                editingId === group.id ? (
                    <input
                        key={group.id}
                        value={editingName}
                        autoFocus
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={commitEdit}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit();
                            if (e.key === 'Escape') setEditingId(null);
                        }}
                    />
                ) : (
                    <div key={group.id} className={styles.item}>
                        <button
                            type="button"
                            className={`${styles.name} ${
                                selectedGroupId === group.id
                                    ? styles.nameActive
                                    : ''
                            }`}
                            onClick={() => onSelectGroup(group.id)}
                        >
                            {group.name}
                        </button>
                        <button
                            type="button"
                            className={styles.iconButton}
                            title="이름 수정"
                            onClick={() => startEdit(group)}
                        >
                            ✎
                        </button>
                        <button
                            type="button"
                            className={styles.iconButton}
                            title="삭제"
                            onClick={() => handleDelete(group)}
                        >
                            ✕
                        </button>
                    </div>
                ),
            )}
            <form className={styles.addForm} onSubmit={handleAdd}>
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="새 group"
                />
                <button type="submit">추가</button>
            </form>
        </div>
    );
}

export default GroupList;
