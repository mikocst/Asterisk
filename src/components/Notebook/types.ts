import type { Id } from "@convex/_generated/dataModel"

export interface Note {
    _id: Id<"notes">;
    title: string;
    _creationTime: number;
    userId: string;      
    lastModified: number;
    preview?: string;
    lexicalData?: string;
    blocks: Array<Block>
    folder: string;
    folderId: Id<"folders"> | null;
    deletedAt?: string;
    isFavorited?: boolean;
}

export interface DraftNote {
    title: string;
    createdAt: number;
    lexicalData?: string;
    blocks: Array<Block>;
    folder: string;
    folderId: Id<"folders"> | null;
    isFavorited?: boolean;
}

export interface Folders {
    id: Id<"folders">
    title: string;
}

export type Blocktype = "p" | "h1" | "h2" | "h3" | "bullet" | "text" 

export interface Block {
    id: string;
    type: Blocktype;
    content:string
}

export interface LexicalTextNode {
  detail: number;
  format: number;
  mode: string;
  style: string;
  text: string;
  type: 'text';
  version: number;
}

export interface LexicalElementNode {
  children: (LexicalTextNode | LexicalElementNode)[];
  direction: 'ltr' | 'rtl' | null;
  format: string;
  indent: number;
  type: string; 
  version: number;
}

export interface LexicalRoot {
  children: LexicalElementNode[];
  direction: 'ltr' | 'rtl' | null;
  format: string;
  indent: number;
  type: 'root';
  version: number;
}

export interface LexicalEditorState {
  root: LexicalRoot;
}

export type SlashMenuItem = "h1" | "h2" | "h3" | "bullet" | "quote" | "text"