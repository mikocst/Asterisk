import React, { createContext, useCallback, useContext, useEffect, useState} from "react";
import {type Note, type DraftNote, type Folders, type Blocktype } from "./types";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel"

interface NotebookProviderProps {
    children: React.ReactNode
}

export interface NoteBookContextProps {
    creatingNote: boolean
    setCreatingNote: (val: boolean) => void
    editingNote: boolean
    setEditingNote: (val: boolean) => void
    activeNoteId: Id<"notes"> | null
    setActiveNoteId: (id: Id<"notes"> | null) => void
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
    isSearching: boolean
    setIsSearching: (val: boolean) => void
    showToast: boolean
    setShowToast: (show: boolean) => void
    handleWriting: () => void
    handleNoteUpdates:(key: keyof DraftNote, value: string) => void
    handleFolders: (newTitle: string) => string
    handleNoteClick: (id: Id<"notes">) => void
    handleDeleteNote: (id: Id<"notes">) => void
    handleUndo: (id:Id<"notes">) => void
    handleDismissToast: (id:Id<"notes">) => void
    handleDeleteFolder:(folderId:string) => void
    handleNoteFavorite:(id: Id<"notes">) => void
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
    const [activeNoteId, setActiveNoteId] = useState<Id<"notes"> | null>(null);
    const [notes, setNotes] = useState<Note[]>([]);
    const [draft, setDraft] = useState<DraftNote | null>(null);
    const [folders, setFolders] = useState<Folders[]>([]);
    const [isMakingFolder, setIsMakingFolder] = useState<boolean>(false);
    const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const cloudNotes = useQuery(api.notes.getNotes);
    const updateBlocks = useMutation(api.notes.updateNoteBlock);
    const createNote = useMutation(api.notes.createNote);

    const handleBlockUpdate = async(
        noteId: Id<"notes">,
        blockId: string,
        newType: Blocktype
        ) => {
        const currentNote = cloudNotes?.find(n => n._id === noteId)
        if (!currentNote) {
            return
        }

        const updatedBlocks = currentNote.blocks.map(block => block.id === blockId ? {...block, type: newType} : block);

        try {
            await updateBlocks({
                noteId,
                blocks: updatedBlocks
            });
        } catch(err) {
            console.error("Failed to sync block type:", err);
        }
    }

    const handleWriting = useCallback(async() => {
        if (activeNoteId) {
            setDraft(null)
        }
        else {
             if (draft && (draft.title.trim() !== "" || draft.content.trim() !== "")) {
            let generatedId = crypto.randomUUID();
            const newNoteId = await createNote({
                title: draft.title,
                blocks: [
                    {
                        id: generatedId,
                        type: "p",
                        content: draft.content
                    }
                ]
            })

            setDraft(null)
            setCreatingNote(false)

            setActiveNoteId(newNoteId)
         }
        } 
    }, [draft, activeNoteId, createNote])

    const handleNoteUpdates = useCallback((key: keyof DraftNote, value: string) => {
       if (activeNoteId) {
        setDraft(prev => prev ? { ...prev, [key]: value } : null);
            setNotes(prevNotes => prevNotes.map((note) => {
                if(activeNoteId === note._id) {
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
                        folderId:"1" ,
                        isFavorited: false,
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
        let generatedFolderId = crypto.randomUUID();
        let newFolder = {
            id: generatedFolderId,
            title: newTitle,
            count: 0,
            content: []
        }

        setFolders(prev => [...prev, newFolder])

        return generatedFolderId
    }, [])

    const handleNoteClick = useCallback((id: Id<"notes">) => {
        const note = notes.find(n => n._id === id);

        if (note){
            const {_id: noteId, ...rest} = note

            setCreatingNote(false);
            setActiveNoteId(id);
            setDraft(rest)
        }
        }, [notes]);

    const handleDeleteNote = useCallback((id: string) => {
            setDraft(null)
            let trashedNote = notes.find(note => note._id === id)

            if(!trashedNote) {
        console.error("FAILED to find note. Check if ID types match (string vs number)");
        return;
    }
            
            if(trashedNote) {
                const deletedNoteWithTimestamp = {
                    ...trashedNote,
                    deletedAt: new Date().toLocaleDateString()
                }

                setDeletedNotes(prev => [deletedNoteWithTimestamp, ...prev]);
                setShowToast(true);
            }

            setNotes(prev => prev.filter(note => note._id !== id))
            if (activeNoteId === id) {
                setDraft(null)
                setActiveNoteId(null)
                setCreatingNote(false)
            }

    },[activeNoteId]);

    const handleUndo = useCallback((id:Id<"notes">) => {
        setDeletedNotes(prev => {
            const noteToRestore = prev.find(n => n._id === id)

            if (noteToRestore) {
                setNotes(currentNotes => [noteToRestore, ...currentNotes]);
            }

            if (prev.length === 1) {
                setShowToast(false)
            }

            return prev.filter(n => n._id !== id)
        })

    }, [])

    const handleDismissToast = useCallback((id:Id<"notes">) => {
        setDeletedNotes((prev) => prev.filter((note) => 
            note._id !== id
        ))
    },[])

    const handleNoteFavorite = useCallback((id:Id<"notes">) => {
        setNotes(prev => prev.map((note) => note._id === id ? {...note, isFavorited: !note.isFavorited} : note
        ))

        setDraft(prev => prev ? { ...prev, isFavorited: !prev.isFavorited } : null);
    }, [])

    const handleDeleteFolder = useCallback((folderId:string) => {

        setFolders((prev) => {
            return prev.filter((folder) => folder.id !== folderId)
        })

        setNotes((prev) => {
            return prev.filter((note) => note.folderId !== folderId)
        })
    }, []) 

    useEffect(() => {
        if (!activeNoteId) {
            return
        }
    
    // useEffect(() => {
    //     if(cloudNotes) {
    //         setNotes(cloudNotes as Note[])
    //     }
    // })

        let handler = setTimeout(() => {
                setNotes(prevNotes => {
                    return(
                        prevNotes.map((note) => {
                        if (activeNoteId === note._id) {
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

        isSearching,
        setIsSearching,

        handleWriting,
        handleNoteUpdates,
        handleFolders,
        handleNoteClick,
        handleDeleteNote,
        handleUndo,
        handleDismissToast,
        handleNoteFavorite,
        handleDeleteFolder,

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