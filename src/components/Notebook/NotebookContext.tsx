import React, { createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {type Note, type DraftNote, type Folders, type Blocktype,type Block } from "./types";
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
    handleNoteUpdates: <K extends keyof DraftNote>(key: K, value: DraftNote[K]) => void;
    handleFolders: (newTitle: string) => string
    handleNoteClick: (id: Id<"notes">) => void
    handleDeleteNote: (id: Id<"notes">) => void
    handleUndo: (id:Id<"notes">) => void
    handleDismissToast: (id:Id<"notes">) => void
    handleDeleteFolder:(folderId:string) => void
    handleNoteFavorite:(id: Id<"notes">) => void
    handleBlockUpdate: (noteId: Id<"notes">,
                        blockId: string,
                        updates: Partial<Pick<Block, 'content' | 'type'>>) => void
    handleBlockSplit: (index: number, 
                       caretPosition: number) => void
    handleBlockMerge: (index: number) => void
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
        updates: Partial<Pick<Block, 'content' | 'type'>>
        ) => {
        if (!draft?.blocks) return;

        const updatedBlocks: Block[] = draft.blocks.map((block) => 
            block.id === blockId ? { ...block, ...updates } : block
            );
        setDraft((prev) => (prev ? { ...prev, blocks: updatedBlocks } : null));
    }

      const handleBlockSplit = (index: number, caretPosition: number) => {
        if(!draft) return;

        const updatedBlocks = [...draft.blocks];
        const currentBlock = updatedBlocks[index];

        const textBefore = currentBlock.content.slice(0, caretPosition);
        const textAfter = currentBlock.content.slice(caretPosition);

        updatedBlocks[index] = {...currentBlock, content: textBefore};

        const newBlock: Block = {
            id: crypto.randomUUID(),
            type: 'text',
            content: textAfter
        }

        updatedBlocks.splice(index + 1, 0, newBlock);

        setDraft(prev => prev ? { ...prev, blocks: updatedBlocks } : null);
    }

    const handleBlockMerge = (index: number) => {
        if(index <= 0) return;

        setDraft(prev => {
            if(!prev) return null;

            const updatedBlocks = [...prev.blocks];
            const currentBlock = updatedBlocks[index];
            const previousBlock = updatedBlocks[index - 1];

            if(!currentBlock || !previousBlock) return prev;

            const mergedContent = previousBlock.content + currentBlock.content;

            updatedBlocks[index - 1] = {
                ...previousBlock,
                content: mergedContent
            }

            updatedBlocks.splice(index, 1);

            return {...prev, blocks: updatedBlocks}
        })
    }

    const handleWriting = useCallback(async() => {
        if (activeNoteId) {
            return
        }
        if(creatingNote && draft) {
            const hasTitle = draft?.title.trim() !== "";
            const hasContent = draft?.blocks && draft.blocks[0]?.content.trim() !== "";

             if (draft && hasTitle || hasContent) {
                try {
                     await createNote({
                        title: draft.title,
                        blocks: draft.blocks,
                        folder: draft.folder,
                        folderId: draft.folderId,
                        isFavorited: false
                    })
                     setDraft(null)
                     setCreatingNote(false)

                }
                catch (err) {
                    console.error("Failed to create note:", err)
                }
            
         }
        } 
    }, [draft, activeNoteId, createNote, creatingNote])

    const handleNoteUpdates = useCallback(<K extends keyof DraftNote>(
    key: K, 
    value: DraftNote[K]
    ) => {
        setDraft(prev => prev ? { ...prev, [key]: value } : null);
    }, [activeNoteId])

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
        const note = cloudNotes?.find(n => n._id === id);

        if (note){
            setCreatingNote(false)
            setActiveNoteId(id);

            const draftContent : DraftNote = {
                title: note.title,
                blocks: note.blocks as Block[],
                isFavorited: note.isFavorited,
                folder: note.folder,
                folderId: note.folderId,
                createdAt: note._creationTime,
            }
            
            setDraft(draftContent)
        }
        }, [cloudNotes]);

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

    const handleNoteFavorite = useCallback(async(id:Id<"notes">) => {
        const noteToFavorite = notes.find(n => n._id === id);

        if(!noteToFavorite) return
        const newStatus = !noteToFavorite.isFavorited;

        setNotes(prev => prev.map ((note) =>
        note._id === id ? {...note, isFavorited: newStatus} : note))

        setDraft(prev => prev ? { ...prev, isFavorited: !prev.isFavorited } : null);
    }, [notes, draft, activeNoteId, updateBlocks])

    const handleDeleteFolder = useCallback((folderId:string) => {

        setFolders((prev) => {
            return prev.filter((folder) => folder.id !== folderId)
        })

        setNotes((prev) => {
            return prev.filter((note) => note.folderId !== folderId)
        })
    }, []) 

    useEffect(() => {
    if (!activeNoteId || !draft) return;

    const handler = setTimeout(async () => {
        try {
            await updateBlocks({
                noteId: activeNoteId,
                blocks: draft.blocks,
                title: draft.title,
                isFavorited: draft.isFavorited
            });
            
            setNotes(prev => prev.map(n => n._id === activeNoteId ? { ...n, ...draft } : n));
            
        } catch (err) {
            console.error("Sync failed:", err);
        }
    }, 500); 

    return () => clearTimeout(handler);
}, [draft?.title, JSON.stringify(draft?.blocks), draft?.isFavorited, activeNoteId]);

    useEffect(() => {
    if (cloudNotes && !activeNoteId) {
        setNotes(cloudNotes as Note[]);
    }
}, [cloudNotes, activeNoteId]);


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
        handleBlockUpdate,
        handleBlockSplit,
        handleBlockMerge,

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