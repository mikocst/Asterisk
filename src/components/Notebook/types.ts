export interface Note {
    id: string;
    title: string;
    createdAt: string;
    folder: string;
    content: string;
}

export interface DraftNote {
    title: string;
    createdAt: string;
    folder: string;
    content: string;
}

export interface Folders {
    id: string;
    title: string;
    count: number;
    content: Note[]
}