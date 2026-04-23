import type { Id } from "@convex/_generated/dataModel"

export interface Note {
    _id: Id<"notes">;
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

export type Blocktype = "p" | "h1" | "h2" | "bullet" | "code"