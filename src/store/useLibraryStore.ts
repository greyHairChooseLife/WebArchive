import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { generateId } from '../lib/ids';
import {
    deleteNoteBody,
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
    updateGroup: (id: string, name: string) => Promise<void>;
    deleteGroup: (id: string) => Promise<void>;
    addTag: (name: string) => Promise<void>;
    updateTag: (id: string, name: string) => Promise<void>;
    deleteTag: (id: string) => Promise<void>;
    addNote: (
        note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>,
    ) => Promise<void>;
    updateNote: (
        id: string,
        patch: Partial<Pick<Note, 'title' | 'tagIds'>>,
    ) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
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

        updateGroup: async (id, name) => {
            set((state) => {
                const group = state.groups.find((g) => g.id === id);
                if (group) group.name = name;
            });
            await setGroups(get().groups);
        },

        deleteGroup: async (id) => {
            const noteIdsToDelete = get()
                .notes.filter((note) => note.groupId === id)
                .map((note) => note.id);

            set((state) => {
                state.groups = state.groups.filter((g) => g.id !== id);
                state.notes = state.notes.filter((note) => note.groupId !== id);
            });

            const promises: Promise<void>[] = [];
            noteIdsToDelete.forEach((id) => promises.push(deleteNoteBody(id)));

            await Promise.all([
                setGroups(get().groups),
                setNotes(get().notes),
                ...promises,
            ]);
        },

        addTag: async (name) => {
            const tag: Tag = { id: generateId(), name };
            set((state) => {
                state.tags.push(tag);
            });
            await setTags(get().tags);
        },

        updateTag: async (id, name) => {
            set((state) => {
                const tag = state.tags.find((t) => t.id === id);
                if (tag) tag.name = name;
            });
            await setTags(get().tags);
        },

        deleteTag: async (id) => {
            set((state) => {
                state.tags = state.tags.filter((t) => t.id !== id);
                for (const note of state.notes) {
                    note.tagIds = note.tagIds.filter((tagId) => tagId !== id);
                }
            });
            await Promise.all([setTags(get().tags), setNotes(get().notes)]);
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

        updateNote: async (id, patch) => {
            set((state) => {
                const note = state.notes.find((n) => n.id === id);
                if (!note) return;
                Object.assign(note, patch);
                note.updatedAt = Date.now();
            });
            await setNotes(get().notes);
        },

        deleteNote: async (id) => {
            set((state) => {
                state.notes = state.notes.filter((n) => n.id !== id);
            });
            await Promise.all([setNotes(get().notes), deleteNoteBody(id)]);
        },
    })),
);
