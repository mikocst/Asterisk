export interface Note {
    id: string;
    title: string;
    createdAt: string;
    folder: string;
    content: string;
    deletedAt?: string
    isFavorited: boolean
}

export interface DraftNote {
    title: string;
    createdAt: string;
    folder: string;
    content: string;
    isFavorited: boolean
}

export interface Folders {
    id: string;
    title: string;
}