import { useState } from 'react';
import { useLibraryStore } from '../../../store/useLibraryStore';
import type { Tag } from '../../../types/entities';
import styles from './TagManager.module.css';

type TagManagerProps = {
    tags: Tag[];
};

function TagManager({ tags }: TagManagerProps) {
    const { addTag, updateTag, deleteTag } = useLibraryStore();
    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const name = newName.trim();
        if (!name) return;
        await addTag(name);
        setNewName('');
    };

    const startEdit = (tag: Tag) => {
        setEditingId(tag.id);
        setEditingName(tag.name);
    };

    const commitEdit = async () => {
        const name = editingName.trim();
        if (editingId && name) {
            await updateTag(editingId, name);
        }
        setEditingId(null);
    };

    const handleDelete = async (tag: Tag) => {
        const confirmed = confirm(
            `"${tag.name}" tag을 삭제하시겠습니까? (note는 유지됩니다)`,
        );
        if (!confirmed) return;
        await deleteTag(tag.id);
    };

    return (
        <div className={styles.container}>
            <div className={styles.title}>tag 관리</div>
            {tags.map((tag) =>
                editingId === tag.id ? (
                    <input
                        key={tag.id}
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
                    <div key={tag.id} className={styles.item}>
                        <span>{tag.name}</span>
                        <button
                            type="button"
                            className={styles.iconButton}
                            title="이름 수정"
                            onClick={() => startEdit(tag)}
                        >
                            ✎
                        </button>
                        <button
                            type="button"
                            className={styles.iconButton}
                            title="삭제"
                            onClick={() => handleDelete(tag)}
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
                    placeholder="새 tag"
                />
                <button type="submit">추가</button>
            </form>
        </div>
    );
}

export default TagManager;
