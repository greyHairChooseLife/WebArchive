import { useEffect, useState } from 'react';
import LibraryView from './components/library/LibraryView';
import { useLibraryStore } from '../store/useLibraryStore';

type View = 'tabs' | 'library';

function App() {
    const [view, setView] = useState<View>('tabs');
    const { loadAll } = useLibraryStore();

    useEffect(() => {
        loadAll();
    }, [loadAll]);

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
            {view === 'tabs' ? <p>탭 뷰</p> : <LibraryView />}
        </>
    );
}

export default App;
