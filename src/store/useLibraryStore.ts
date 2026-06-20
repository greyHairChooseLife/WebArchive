import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { generateId } from '../lib/ids';
import {
    getGroups,
    getNotes,
    getTags,
    setGroups,
    setNotes,
    setTags,
} from '../lib/storage';
import type { Group, Note, Tag } from '../types/entities';

type LibraryState = {
    groups: Group[];
    tags: Tag[];
    notes: Note[];
    loadAll: () => Promise<void>;
    addGroup: (name: string) => Promise<void>;
    addTag: (name: string) => Promise<void>;
    addNote: (
        note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
    ) => Promise<void>;
};

export const useLibraryStore = create<LibraryState>()(
    immer((set, get) => ({
        groups: [],
        tags: [],
        notes: [],

        loadAll: async () => {
            const [groups, tags, notes] = await Promise.all([
                getGroups(),
                getTags(),
                getNotes(),
            ]);
            set((state) => {
                state.groups = groups;
                state.tags = tags;
                state.notes = notes;
            });
        },

        addGroup: async (name) => {
            const group: Group = { id: generateId(), name };
            set((state) => {
                state.groups.push(group);
            });
            await setGroups(get().groups);
        },

        addTag: async (name) => {
            const tag: Tag = { id: generateId(), name };
            set((state) => {
                state.tags.push(tag);
            });
            await setTags(get().tags);
        },

        addNote: async ({ groupId, url, title, favicon, tagIds }) => {
            const now = Date.now();
            const fullNote: Note = {
                groupId,
                url,
                title,
                favicon,
                tagIds,
                id: generateId(),
                createdAt: now,
                updatedAt: now,
            };
            set((state) => {
                state.notes.push(fullNote);
            });
            await setNotes(get().notes);
        },
    })),
);
