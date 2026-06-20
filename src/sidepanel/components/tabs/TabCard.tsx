import { formatLastAccessed, getDomain, type LiveTab } from '../../../lib/tabs';
import styles from './TabCard.module.css';

type TabCardProps = {
    tab: LiveTab;
    checked: boolean;
    onToggle: (tabId: number) => void;
};

function TabCard({ tab, checked, onToggle }: TabCardProps) {
    return (
        <div className={styles.card}>
            <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(tab.id)}
            />
            {tab.favIconUrl ? (
                <img className={styles.favicon} src={tab.favIconUrl} alt="" />
            ) : null}
            <div className={styles.cardText}>
                <div className={styles.title}>{tab.title}</div>
                <div className={styles.meta}>
                    {getDomain(tab.url)} ·{' '}
                    {formatLastAccessed(tab.lastAccessed)}
                </div>
            </div>
        </div>
    );
}

export default TabCard;
