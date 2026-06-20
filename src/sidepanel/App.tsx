import { useEffect, useState } from 'react';
import LibraryView from './components/library/LibraryView';
import TabsView from './components/tabs/TabsView';
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
            {view === 'tabs' ? <TabsView /> : <LibraryView />}
        </>
    );
}

export default App;
