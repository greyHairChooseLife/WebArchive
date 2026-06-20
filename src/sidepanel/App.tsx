import { useEffect, useState } from 'react';
import LibraryView from './components/library/LibraryView';
import SettingsView from './components/settings/SettingsView';
import TabsView from './components/tabs/TabsView';
import { useLibraryStore } from '../store/useLibraryStore';
import styles from './App.module.css';

type View = 'tabs' | 'library' | 'settings';

const VIEWS: { id: View; label: string }[] = [
    { id: 'tabs', label: 'TABS' },
    { id: 'library', label: 'ARCHIVE' },
    { id: 'settings', label: 'CONFIG' },
];

function App() {
    const [view, setView] = useState<View>('tabs');
    const { loadAll } = useLibraryStore();

    useEffect(() => {
        loadAll();
    }, [loadAll]);

    // 콘텐츠 화면(TABS·ARCHIVE)은 항목이 많아 CRT 스캔라인이 가독성을 해침 → 끈다.
    // CONFIG에서만 스캔라인 유지.
    useEffect(() => {
        document.body.classList.toggle('noScanline', view !== 'settings');
    }, [view]);

    return (
        <div className={styles.shell}>
            <header className={styles.header}>
                <span className={styles.prompt}>WEBARCHIVE.SYS</span>
                <span className={styles.cursor}>█</span>
            </header>
            <nav className={styles.nav}>
                {VIEWS.map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        className={
                            view === v.id ? styles.navActive : styles.navItem
                        }
                        onClick={() => setView(v.id)}
                    >
                        {v.label}
                    </button>
                ))}
            </nav>
            <main className={styles.viewport}>
                {view === 'tabs' ? (
                    <TabsView />
                ) : view === 'library' ? (
                    <LibraryView />
                ) : (
                    <SettingsView />
                )}
            </main>
        </div>
    );
}

export default App;
