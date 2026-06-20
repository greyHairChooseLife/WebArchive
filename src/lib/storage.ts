import type { Group, Note, NoteBody, Tag } from '../types/entities';

const KEYS = {
    groups: 'groups',
    tags: 'tags',
    notes: 'notes',
    noteBodies: 'noteBodies',
} as const;

export async function getGroups(): Promise<Group[]> {
    const result = await chrome.storage.local.get(KEYS.groups);
    return (result[KEYS.groups] as Group[]) ?? [];
}

export async function setGroups(groups: Group[]): Promise<void> {
    await chrome.storage.local.set({ [KEYS.groups]: groups });
}

export async function getTags(): Promise<Tag[]> {
    const result = await chrome.storage.local.get(KEYS.tags);
    return (result[KEYS.tags] as Tag[]) ?? [];
}

export async function setTags(tags: Tag[]): Promise<void> {
    await chrome.storage.local.set({ [KEYS.tags]: tags });
}

export async function getNotes(): Promise<Note[]> {
    const result = await chrome.storage.local.get(KEYS.notes);
    return (result[KEYS.notes] as Note[]) ?? [];
}

export async function setNotes(notes: Note[]): Promise<void> {
    await chrome.storage.local.set({ [KEYS.notes]: notes });
}

export async function getNoteBody(id: string): Promise<NoteBody | undefined> {
    const result = await chrome.storage.local.get(KEYS.noteBodies);
    const noteBodies =
        (result[KEYS.noteBodies] as Record<string, NoteBody>) ?? {};
    return noteBodies[id];
}

export async function setNoteBody(id: string, body: NoteBody): Promise<void> {
    const result = await chrome.storage.local.get(KEYS.noteBodies);
    const noteBodies =
        (result[KEYS.noteBodies] as Record<string, NoteBody>) ?? {};
    noteBodies[id] = body;
    await chrome.storage.local.set({ [KEYS.noteBodies]: noteBodies });
}

export async function deleteNoteBody(id: string): Promise<void> {
    const result = await chrome.storage.local.get(KEYS.noteBodies);
    const noteBodies =
        (result[KEYS.noteBodies] as Record<string, NoteBody>) ?? {};
    delete noteBodies[id];
    await chrome.storage.local.set({ [KEYS.noteBodies]: noteBodies });
}

export async function getNoteBodies(): Promise<Record<string, NoteBody>> {
    const result = await chrome.storage.local.get(KEYS.noteBodies);
    return (result[KEYS.noteBodies] as Record<string, NoteBody>) ?? {};
}

export async function setNoteBodies(
    noteBodies: Record<string, NoteBody>,
): Promise<void> {
    await chrome.storage.local.set({ [KEYS.noteBodies]: noteBodies });
}
