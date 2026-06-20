import type { Tag } from '../../../types/entities';
import styles from './TagFilter.module.css';

type TagFilterProps = {
    tags: Tag[];
    selectedTagId: string | null;
    onSelectTag: (tagId: string | null) => void;
    scopeToGroup: boolean;
    onScopeToGroupChange: (value: boolean) => void;
};

function TagFilter({
    tags,
    selectedTagId,
    onSelectTag,
    scopeToGroup,
    onScopeToGroupChange,
}: TagFilterProps) {
    return (
        <div className={styles.container}>
            <select
                value={selectedTagId ?? ''}
                onChange={(e) => onSelectTag(e.target.value || null)}
            >
                <option value="">전체 tag</option>
                {tags.map((tag) => (
                    <option key={tag.id} value={tag.id}>
                        {tag.name}
                    </option>
                ))}
            </select>
            <label className={styles.checkboxLabel}>
                <input
                    type="checkbox"
                    checked={scopeToGroup}
                    onChange={(e) => onScopeToGroupChange(e.target.checked)}
                />
                현재 group만
            </label>
        </div>
    );
}

export default TagFilter;
