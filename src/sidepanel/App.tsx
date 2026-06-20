import { useEffect, useState } from 'react';
import { useLibraryStore } from '../store/useLibraryStore';

type View = 'tabs' | 'library';

function App() {
    const [view, setView] = useState<View>('tabs');
    const { groups, notes, loadAll, addGroup, addNote } = useLibraryStore();

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    const handleAddTestNote = async () => {
        let { id: groupId } = groups[0] ?? {};
        if (!groupId) {
            await addGroup('테스트 그룹');
            ({ id: groupId } = useLibraryStore.getState().groups[0] ?? {});
        }
        if (!groupId) return;
        await addNote({
            groupId,
            url: 'https://example.com',
            title: 'Example',
            favicon: '',
            tagIds: [],
        });
    };

    return (
        <>
            <nav>
                <button type="button" onClick={() => setView('tabs')}>
                    탭
                </button>
                <button type="button" onClick={() => setView('library')}>
                    라이브러리
                </button>
            </nav>
            {view === 'tabs' ? (
                <p>탭 뷰</p>
            ) : (
                <div>
                    <button type="button" onClick={handleAddTestNote}>
                        테스트 note 추가
                    </button>
                    <ul>
                        {notes.map((note) => (
                            <li key={note.id}>
                                {note.title} ({note.url})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </>
    );
}

export default App;
