import type { Id } from "@convex/_generated/dataModel"

export interface Note {
    _id: Id<"notes">;
    title: string;
    _creationTime: number;
    userId: string;      
    lastModified: number;
    blocks: Array<Block>
    folder: string;
    folderId: string | null
    deletedAt?: string
    isFavorited?: boolean
}

export interface DraftNote {
    title: string;
    createdAt: number;
    blocks: Array<Block>
    folder: string;
    folderId: string | null
    isFavorited?: boolean
}

export interface Folders {
    id: string;
    title: string;
}

export type Blocktype = "p" | "h1" | "h2" | "h3" | "bullet" | "text" 

export interface Block {
    id: string;
    type: Blocktype;
    content:string
}