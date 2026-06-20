import { useRef } from 'react';
import { exportData, importData } from '../../../lib/backup';
import { useLibraryStore } from '../../../store/useLibraryStore';
import styles from './SettingsView.module.css';

function SettingsView() {
    const { loadAll } = useLibraryStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;

        const confirmed = confirm(
            '기존 데이터를 모두 지우고 파일 내용으로 교체합니다. 계속하시겠습니까?',
        );
        if (!confirmed) return;

        const text = await file.text();
        await importData(text);
        await loadAll();
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>데이터 관리</h2>
            <div className={styles.actions}>
                <button type="button" onClick={() => exportData()}>
                    내보내기 (JSON)
                </button>
                <button type="button" onClick={handleImportClick}>
                    가져오기 (JSON)
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    className={styles.hiddenInput}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

export default SettingsView;
