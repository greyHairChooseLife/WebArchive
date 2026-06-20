import type { Note } from '../../../types/entities';
import styles from './NoteList.module.css';

type NoteListProps = {
    notes: Note[];
    groupId: string;
    selectedNoteId: string | null;
    onSelectNote: (noteId: string) => void;
};

function NoteList({ notes, selectedNoteId, onSelectNote }: NoteListProps) {
    const sortedNotes = [...notes].sort((a, b) => b.createdAt - a.createdAt);

    return (
        <div className={styles.container}>
            {sortedNotes.length === 0 ? (
                <p className={styles.empty}>note가 없습니다.</p>
            ) : (
                sortedNotes.map((note) => (
                    <div
                        key={note.id}
                        className={`${styles.card} ${
                            selectedNoteId === note.id ? styles.cardActive : ''
                        }`}
                        onClick={() => onSelectNote(note.id)}
                    >
                        {note.favicon ? (
                            <img
                                className={styles.favicon}
                                src={note.favicon}
                                alt=""
                            />
                        ) : null}
                        <div className={styles.cardText}>
                            <div className={styles.title}>{note.title}</div>
                            <div className={styles.url}>{note.url}</div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default NoteList;
