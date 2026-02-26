import React, { createContext, useCallback, useContext, useState} from "react";
import {type Note, type DraftNote, type Folders } from "./types";

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
    folders: Folders[]
    setFolders: (Folder: Folders[]) => void
    isMakingFolder: boolean
    setIsMakingFolder: (making: boolean) => void
    handleWriting: () => void
    handleNoteUpdates:(key: keyof DraftNote, value: string) => void
    handleFolders: (newTitle: string) => void
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
    const [folders, setFolders] = useState<Folders[]>([]);
    const [isMakingFolder, setIsMakingFolder] = useState<boolean>(false);

    const handleWriting = useCallback(() => {
       if (activeNoteId) {
            setNotes(prevNotes => prevNotes.map((note) => {
               if (activeNoteId === note.id) {
                return {
                    ...note,
                    title: draft?.title || "",
                    content: draft?.content || ""
                }
               }
               else {
                return note
               }
            }))
       }
       else {
         if (draft && (draft.title.trim() !== "" || draft.content.trim() !== "")) {
            let generatedId = crypto.randomUUID();
            const finalNote = {
                id: generatedId,
                ...draft
            }
            setNotes(prev => [...prev, finalNote])

            setActiveNoteId(generatedId)
            setDraft(null)
            setCreatingNote(false)
        }
       }
    }, [draft])

    const handleNoteUpdates = useCallback((key: keyof DraftNote, value: string) => {
       if (activeNoteId) {
            setNotes(prevNotes => prevNotes.map((note) => {
                if(activeNoteId === note.id) {
                    return {
                        ...note, [key]: value                    
                    }
                }
                else {
                    return note
                }
            }))
       }

       else {
         setDraft((prev) => {
            if (!prev) {
                return (
                    {
                        title: "",
                        content: "",
                        createdAt: new Date().toISOString(),
                        folder: "General",
                        [key]: value
                    }
                )
            }

            else {
                return (
                    {...prev, [key]: value}
                )
            }
           })
       }
    },[]);

    const handleFolders = useCallback((newTitle: string) => {
        let newFolder = {
            id: crypto.randomUUID(),
            title: newTitle,
            count: 0,
            content: []
        }

        setFolders(prev => [...prev, newFolder])
    }, [])

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
        setDraft,

        folders,
        setFolders,

        isMakingFolder,
        setIsMakingFolder,

        handleWriting,
        handleNoteUpdates,
        handleFolders
    }

    return (
        <NotebookContext.Provider value = {value}>
            {children}
        </NotebookContext.Provider>
    )
}

export default NotebookProvider