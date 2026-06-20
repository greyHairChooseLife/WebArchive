import { useState } from 'react';

type View = 'tabs' | 'library';

function App() {
    const [view, setView] = useState<View>('tabs');

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
            {view === 'tabs' ? <p>탭 뷰</p> : <p>라이브러리 뷰</p>}
        </>
    );
}

export default App;
