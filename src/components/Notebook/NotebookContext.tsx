import React, { createContext, useCallback, useContext, useEffect, useState} from "react";
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
    deletedNotes: Note[]
    setDeletedNotes: (deletedNotes: Note[]) => void
    showToast: boolean
    setShowToast: (show: boolean) => void
    handleWriting: () => void
    handleNoteUpdates:(key: keyof DraftNote, value: string) => void
    handleFolders: (newTitle: string) => void
    handleNoteClick: (id: string) => void
    handleDeleteNote: (id: string) => void
    handleUndo: (id:string) => void
    handleDismissToast: (id:string) => void
    handleNoteFavorite: (id:string) => void
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
    const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
    const [showToast, setShowToast] = useState<boolean>(false);

    const favoriteNotes = notes.filter((note) => note.isFavorited)

    const handleWriting = useCallback(() => {
        if (activeNoteId) {
            setDraft(null)
        }
        else {
             if (draft && (draft.title.trim() !== "" || draft.content.trim() !== "")) {
            let generatedId = crypto.randomUUID();
            const finalNote = {
                id: generatedId,
                ...draft
            }
            setNotes(prev => [...prev, finalNote])

            setDraft(null)
            setCreatingNote(false)
        }
        }
       
    }, [draft])

    const handleNoteUpdates = useCallback((key: keyof DraftNote, value: string) => {
       if (activeNoteId) {
        setDraft(prev => prev ? { ...prev, [key]: value } : null);
            setNotes(prevNotes => prevNotes.map((note) => {
                if(activeNoteId === note.id) {
                    return {
                        ...note, [key]: value                    
                    }
                }
                    return note
                
            }))
       }

       else {
         setDraft((prev) => {
            if (!prev) {
                return (
                    {
                        title: "",
                        content: "",
                        createdAt: new Date().toLocaleDateString(),
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
    },[activeNoteId]);

    const handleFolders = useCallback((newTitle: string) => {
        let newFolder = {
            id: crypto.randomUUID(),
            title: newTitle,
            count: 0,
            content: []
        }

        setFolders(prev => [...prev, newFolder])
    }, [])

    const handleNoteClick = useCallback((id: string) => {
        const note = notes.find(n => n.id === id);

        if (note){
            setCreatingNote(false);
            setActiveNoteId(id);
            setDraft({...note})
        }
        }, [notes]);

    const handleDeleteNote = useCallback((id: string) => {
            setDraft(null)
             console.log("Delete triggered for ID:", id);
            console.log("Current notes in state:", notes);
            let trashedNote = notes.find(note => note.id === id)

            if(!trashedNote) {
        console.error("FAILED to find note. Check if ID types match (string vs number)");
        return;
    }
            
            if(trashedNote) {
                setDeletedNotes(prev => [trashedNote, ...prev]);
                setShowToast(true);
            }

            setNotes(prev => prev.filter(note => note.id !== id))
            if (activeNoteId === id) {
                setDraft(null)
                setActiveNoteId(null)
                setCreatingNote(false)
            }

    },[activeNoteId]);

    const handleUndo = useCallback((id:string) => {
        setDeletedNotes(prev => {
            const noteToRestore = prev.find(n => n.id === id)

            if (noteToRestore) {
                setNotes(currentNotes => [noteToRestore, ...currentNotes]);
            }

            if (prev.length === 1) {
                setShowToast(false)
            }

            return prev.filter(n => n.id !== id)
        })

    }, [])

    const handleDismissToast = useCallback((id:string) => {
        setDeletedNotes((prev) => prev.filter((note) => 
            note.id !== id
        ))
    },[])

    const handleNoteFavorite = useCallback((id:string) => {
        setNotes(prev => prev.map((note) => note.id === id ? {...note, isFavorited: !note.isFavorited} : note
        ))
    }, [])

    useEffect(() => {
        console.log('initiating save')
        if (!activeNoteId) {
            return
        }

        let handler = setTimeout(() => {
                setNotes(prevNotes => {
                    return(
                        prevNotes.map((note) => {
                        if (activeNoteId === note.id) {
                            return {...note, ...draft}
                        }

                        else {
                            return (note)
                        }
                    })
                    )
                })
            }, 5000)
            return (() => clearTimeout(handler))
    }, [draft, activeNoteId])

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
        handleFolders,
        handleNoteClick,
        handleDeleteNote,
        handleUndo,
        handleDismissToast,
        handleNoteFavorite,

        deletedNotes,
        setDeletedNotes,
        showToast,
        setShowToast
    }

    return (
        <NotebookContext.Provider value = {value}>
            {children}
        </NotebookContext.Provider>
    )
}

export default NotebookProvider