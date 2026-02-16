import React, { createContext, useContext, useState} from "react";
import {type Note, type DraftNote } from "./types";

interface NotebookProviderProps {
    children: React.ReactNode
}

export interface NoteBookContextProps {
    creatingNote: boolean
    setCreatingNote: (val: boolean) => void
    editingNote: boolean
    setEditingNote: (val: boolean) => void
    activeNoteId: string | null
    setActiveNoteId: (id: string | null) => void
    notes: Note[];
    setNotes: (noteList: Note[]) => void;
    draft: DraftNote | null;
    setDraft: (Draft: DraftNote | null) => void
}

export const NotebookContext = createContext<NoteBookContextProps | undefined>(undefined);

export const useNotebook = () => {
    const context = useContext(NotebookContext);

    if(!context) {
        throw new Error("Notebook Context must be used in Notebook provider")
    }

    else {
        return context
    }
}

export const NotebookProvider = ({children}: NotebookProviderProps) => {
    const [creatingNote, setCreatingNote] = useState<boolean>(false);
    const [editingNote, setEditingNote] = useState<boolean>(false);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [draft, setDraft] = useState<DraftNote | null>(null);

    const handleDraft = () => {
        if (draft && (draft.title.trim() !== "" && draft.content.trim() !== "")) {
            let generatedId = crypto.randomUUID();
            const finalNote = {
                id: generatedId,
                ...draft
            }
            setNotes(prev => [...prev, finalNote])

            setActiveNoteId(generatedId)
            setCreatingNote(false)
            setDraft(null)
        }
    }

    const value = {
        creatingNote,
        setCreatingNote,

        editingNote,
        setEditingNote,

        activeNoteId,
        setActiveNoteId,

        notes,
        setNotes,

        draft,
        setDraft

    }

    return (
        <NotebookContext.Provider value = {value}>
            {children}
        </NotebookContext.Provider>
    )
}

export default NotebookProvider