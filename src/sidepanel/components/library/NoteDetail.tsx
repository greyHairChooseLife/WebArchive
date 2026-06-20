import { useEffect, useState } from 'react';
import { getNoteBody, setNoteBody } from '../../../lib/storage';
import { useLibraryStore } from '../../../store/useLibraryStore';
import type { Note, Tag } from '../../../types/entities';
import styles from './NoteDetail.module.css';

type NoteDetailProps = {
    note: Note;
    tags: Tag[];
    onClose: () => void;
};

function NoteDetail({ note, tags, onClose }: NoteDetailProps) {
    const { updateNote, deleteNote } = useLibraryStore();
    const [title, setTitle] = useState(note.title);
    const [tagIds, setTagIds] = useState<string[]>(note.tagIds);
    const [memo, setMemo] = useState('');

    useEffect(() => {
        setTitle(note.title);
        setTagIds(note.tagIds);
        setMemo('');
        getNoteBody(note.id).then((body) => {
            setMemo(body?.content ?? '');
        });
    }, [note.id, note.title, note.tagIds]);

    const handleTitleBlur = async () => {
        const trimmed = title.trim();
        if (trimmed && trimmed !== note.title) {
            await updateNote(note.id, { title: trimmed });
        }
    };

    const toggleTag = async (tagId: string) => {
        const next = tagIds.includes(tagId)
            ? tagIds.filter((id) => id !== tagId)
            : [...tagIds, tagId];
        setTagIds(next);
        await updateNote(note.id, { tagIds: next });
    };

    const handleMemoBlur = async () => {
        await setNoteBody(note.id, {
            id: note.id,
            format: 'plain',
            content: memo,
        });
    };

    const handleDelete = async () => {
        const confirmed = confirm(`"${note.title}" note를 삭제하시겠습니까?`);
        if (!confirmed) return;
        await deleteNote(note.id);
        onClose();
    };

    return (
        <div className={styles.container}>
            <div className={styles.actions}>
                <button type="button" onClick={onClose}>
                    닫기
                </button>
                <button type="button" onClick={handleDelete}>
                    삭제
                </button>
            </div>
            <div className={styles.field}>
                <label htmlFor="note-title">제목</label>
                <input
                    id="note-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                />
            </div>
            <div className={styles.url}>{note.url}</div>
            <div className={styles.field}>
                <span>tag</span>
                <div className={styles.tagList}>
                    {tags.map((tag) => (
                        <label key={tag.id} className={styles.tagOption}>
                            <input
                                type="checkbox"
                                checked={tagIds.includes(tag.id)}
                                onChange={() => toggleTag(tag.id)}
                            />
                            {tag.name}
                        </label>
                    ))}
                </div>
            </div>
            <div className={styles.field}>
                <label htmlFor="note-memo">memo</label>
                <textarea
                    id="note-memo"
                    rows={6}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    onBlur={handleMemoBlur}
                />
            </div>
        </div>
    );
}

export default NoteDetail;
