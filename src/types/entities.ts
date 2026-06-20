export type Group = {
    id: string;
    name: string;
};

export type Tag = {
    id: string;
    name: string;
};

export type Note = {
    id: string;
    groupId: string;
    url: string;
    title: string;
    favicon: string;
    tagIds: string[];
    createdAt: number;
    updatedAt: number;
};

export type NoteBody = {
    id: string;
    format: 'plain';
    content: string;
};
