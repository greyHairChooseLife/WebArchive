import { useState } from 'react';
import { getDomain } from '../../../lib/tabs';
import { useLibraryStore } from '../../../store/useLibraryStore';
import type { Note } from '../../../types/entities';
import styles from './NoteList.module.css';

type NoteListProps = {
    notes: Note[];
    groupId: string;
    selectedNoteId: string | null;
    onSelectNote: (noteId: string) => void;
};

function NoteList({
    notes,
    groupId,
    selectedNoteId,
    onSelectNote,
}: NoteListProps) {
    const { addNote } = useLibraryStore();
    const [url, setUrl] = useState('');
    const [title, setTitle] = useState('');

    const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

    const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!url.trim() || !title.trim()) return;
        await addNote({
            groupId,
            url: url.trim(),
            title: title.trim(),
            favicon: '',
            tagIds: [],
        });
        setUrl('');
        setTitle('');
    };

    return (
        <div className={styles.container}>
            <form className={styles.addForm} onSubmit={handleAdd}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목"
                />
                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="URL"
                />
                <button type="submit">note 추가</button>
            </form>
            {sortedNotes.length === 0 ? (
                <p className={styles.empty}>note가 없습니다.</p>
            ) : (
                <div className={styles.grid}>
                    {sortedNotes.map((note) => (
                        <button
                            type="button"
                            key={note.id}
                            className={`${styles.card} ${
                                selectedNoteId === note.id
                                    ? styles.cardActive
                                    : ''
                            }`}
                            onClick={() => onSelectNote(note.id)}
                        >
                            {note.favicon ? (
                                <img
                                    className={styles.favicon}
                                    src={note.favicon}
                                    alt=""
                                />
                            ) : (
                                <div className={styles.faviconFallback}>
                                    {note.title.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <div className={styles.title}>{note.title}</div>
                            <div className={styles.domain}>
                                {getDomain(note.url)}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NoteList;
