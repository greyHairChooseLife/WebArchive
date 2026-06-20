import type { Group, Note, NoteBody, Tag } from '../types/entities';
import {
    getGroups,
    getNoteBodies,
    getNotes,
    getTags,
    setGroups,
    setNoteBodies,
    setNotes,
    setTags,
} from './storage';

type BackupData = {
    groups: Group[];
    tags: Tag[];
    notes: Note[];
    noteBodies: Record<string, NoteBody>;
};

export async function exportData(): Promise<void> {
    const [groups, tags, notes, noteBodies] = await Promise.all([
        getGroups(),
        getTags(),
        getNotes(),
        getNoteBodies(),
    ]);
    const data: BackupData = { groups, tags, notes, noteBodies };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webarchive-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export async function importData(json: string): Promise<void> {
    const data = JSON.parse(json) as BackupData;
    await Promise.all([
        setGroups(data.groups ?? []),
        setTags(data.tags ?? []),
        setNotes(data.notes ?? []),
        setNoteBodies(data.noteBodies ?? {}),
    ]);
}
