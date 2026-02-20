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
    title: string;
    count: number;
    content: Note[]
}