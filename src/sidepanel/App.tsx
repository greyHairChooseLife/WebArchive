import { useEffect, useState } from 'react';
import LibraryView from './components/library/LibraryView';
import SettingsView from './components/settings/SettingsView';
import TabsView from './components/tabs/TabsView';
import { useLibraryStore } from '../store/useLibraryStore';

type View = 'tabs' | 'library' | 'settings';

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
                <button type="button" onClick={() => setView('settings')}>
                    설정
                </button>
            </nav>
            {view === 'tabs' ? (
                <TabsView />
            ) : view === 'library' ? (
                <LibraryView />
            ) : (
                <SettingsView />
            )}
        </>
    );
}

export default App;
