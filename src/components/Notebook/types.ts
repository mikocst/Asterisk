export interface Note {
    id: string;
    title: string;
    createdAt: string;
    folder: string;
    folderId: string | null
    content: string;
    deletedAt?: string
    isFavorited: boolean
}

export interface DraftNote {
    title: string;
    createdAt: string;
    folder: string;
    folderId: string | null
    content: string;
    isFavorited: boolean
}

export interface Folders {
    id: string;
    title: string;
}