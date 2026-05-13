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
    draft: DraftNote | null;
    setDraft: (Draft: DraftNote | null) => void
    isMakingFolder: boolean
    setIsMakingFolder: (making: boolean) => void
    deletedNotes: Note[]
    setDeletedNotes: (deletedNotes: Note[]) => void
    isSearching: boolean
    setIsSearching: (val: boolean) => void
    showToast: boolean
    setShowToast: (show: boolean) => void
    folders: Folders[]
    handleWriting: () => Promise<void>
    handleNoteUpdates: (updates: Partial<DraftNote>) => void;
    handleFolders: (newTitle: string) => Promise<Id<"folders"> | undefined>
    handleNoteClick: (id: Id<"notes">) => void
    handleDeleteNote: (id: Id<"notes">) => void
    handleUndo: (id:Id<"notes">) => void
    handleDismissToast: (id:Id<"notes">) => void
    handleDeleteFolder:(folderId:string) => void
    handleNoteFavorite:(id: Id<"notes">) => void
    handleBlockUpdate: (noteId: Id<"notes"> | null,
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
    const [draft, setDraft] = useState<DraftNote | null>(null);
    const [isMakingFolder, setIsMakingFolder] = useState<boolean>(false);
    const [deletedNotes, setDeletedNotes] = useState<Note[]>([]);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [isSearching, setIsSearching] = useState<boolean>(false);

    const isSaving = useRef(false);

    const cloudNotes = useQuery(api.notes.getNotes);
    const cloudFolders = useQuery(api.folders.getFoldersWithNotes);

    const updateBlocks = useMutation(api.notes.updateNoteBlock);
    const createNote = useMutation(api.notes.createNote);
    const removeNote = useMutation(api.notes.deleteNoteBlock);
    const createFolderMutation = useMutation(api.folders.createFolder);
    const deleteFolderMutation = useMutation(api.folders.removeFolder);

    const folders: Folders[] = cloudFolders?.map(f => ({
    id: f._id,
    title: f.title,
    count: f.count,
    })) ?? [];
    const notes = (cloudNotes as Note[]) ?? [];

    const handleBlockUpdate = async(
        id: Id<"notes"> | null,
        blockId: string,
        updates: Partial<Pick<Block, 'content' | 'type'>>
        ) => {
        if (!draft?.blocks) return;

        setDraft(prev => {
            if(!prev) return prev;
            return {
                ...prev,
                blocks: prev.blocks.map(b => b.id === blockId ? {...b, ...updates} : b)
            }
        })
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
        if (activeNoteId || isSaving.current) {
            return
        }
        if(creatingNote && draft) {
            const hasTitle = draft?.title.trim() !== "";
            const hasContent = draft?.blocks && draft.blocks[0]?.content.trim() !== "";
            const hasFolder = !!draft?.folderId

             if (draft && (hasTitle || hasContent || hasFolder)) {
                try {
                     const newId = await createNote({
                        title: draft.title,
                        blocks: draft.blocks,
                        lexicalData: draft.lexicalData,
                        folder: draft.folder ?? undefined,
                        folderId: draft.folderId,
                        isFavorited: false
                    })
                     setActiveNoteId(newId)
                     setCreatingNote(false)
                }
                catch (err) {
                    console.error("Failed to create note:", err)
                }
            
         }
        } 
    }, [draft, activeNoteId, createNote, creatingNote])

    const handleNoteUpdates = useCallback((updates: Partial<DraftNote>) => {
    setDraft(prev => prev ? { ...prev, ...updates } : null);
    }, []);

    const handleFolders = useCallback(async(newTitle: string) => {
        try {
            const generatedFolderId = await createFolderMutation({
                title: newTitle
            });

            return generatedFolderId
        } catch(err) {
            console.error("folder creation failed:", err)
        }
    }, [createFolderMutation])

    const handleNoteClick = useCallback((id: Id<"notes">) => {
        const note = cloudNotes?.find(n => n._id === id);

        if (note){
            setCreatingNote(false)
            setActiveNoteId(id);

            const draftContent : DraftNote = {
                title: note.title,
                lexicalData: note.lexicalData,
                blocks: note.blocks as Block[],
                isFavorited: note.isFavorited,
                folder: note.folder,
                folderId: note.folderId,
                createdAt: note._creationTime,
            }
            
            setDraft(draftContent)
        }
        }, [cloudNotes]);

    const handleDeleteNote = useCallback((id: Id<'notes'>) => {
            setDraft(null)
            let trashedNote = cloudNotes?.find(note => note._id === id)

            if(!trashedNote) {
            return;
    }
            
            if(trashedNote) {
                const deletedNoteWithTimestamp = {
                    ...trashedNote,
                    deletedAt: new Date().toLocaleDateString(),
                    blocks: trashedNote.blocks as Block[]
                }
                setDeletedNotes(prev => [deletedNoteWithTimestamp, ...prev]);
                setShowToast(true);
            }

            removeNote({noteId: id})
            
            if (activeNoteId === id) {
                setDraft(null)
                setActiveNoteId(null)
                setCreatingNote(false)
            }

    },[activeNoteId, cloudNotes, removeNote]);

    const handleUndo = useCallback(async (id:Id<"notes">) => {
        const noteToRestore = deletedNotes.find((n) => n._id === id);

        if(noteToRestore){
            try{
                const {
                    _id, 
                    _creationTime, 
                    deletedAt, 
                    isFavorited, 
                    lastModified,
                    userId,
                    ...restOfNote
                } = noteToRestore

                await createNote({
                    ...restOfNote,
                    isFavorited: isFavorited ?? false,
                });

                setDeletedNotes(prev => {
                const newTrash = prev.filter(n => n._id !== id);
                if (newTrash.length === 0) setShowToast(false);
                return newTrash;
                });
            } catch(error) {
                console.error("Failed to restore note:", error)
            }
        }
    }, [deletedNotes, createNote])

    const handleDismissToast = useCallback((id:Id<"notes">) => {
        setDeletedNotes((prev) => prev.filter((note) => 
            note._id !== id
        ))
    },[])

    const handleNoteFavorite = useCallback(async(id: Id<"notes">) => {
    const noteToFavorite = notes.find(n => n._id === id);
    if(!noteToFavorite) return;
    
    const newStatus = !noteToFavorite.isFavorited;

    setDraft(prev => prev ? { ...prev, isFavorited: newStatus } : null);

   
    await updateBlocks({
        noteId: id,
        isFavorited: newStatus,
        blocks: draft?.blocks || noteToFavorite.blocks as Block[],
        });
    }, [notes, draft, updateBlocks]);

    const handleDeleteFolder = useCallback(async (folderId:string) => {
        try {
        await deleteFolderMutation({ id: folderId as Id<"folders"> });
        
        if (activeNoteId) {
            setActiveNoteId(null);
            setDraft(null);
        }
        } catch (err) {
        console.error("Failed to delete folder:", err);
         }
    }, [deleteFolderMutation, activeNoteId]) 

    useEffect(() => {
    if (!activeNoteId || !draft) return;

    const handler = setTimeout(async () => {
        try {
            await updateBlocks({
                noteId: activeNoteId,
                blocks: draft.blocks,
                lexicalData: draft.lexicalData,
                title: draft.title,
                isFavorited: draft.isFavorited,
                folder: draft.folder ?? undefined,
                folderId: draft.folderId ?? undefined
            });
            
        } catch (err) {
            console.error("Sync failed:", err);
        }
    }, 500); 

    return () => clearTimeout(handler);
    }, [draft?.title, draft?.isFavorited, draft?.folderId, draft?.lexicalData, draft?.blocks, draft?.folder, activeNoteId]);

    useEffect(() => {
        if(activeNoteId === null && !creatingNote) {
            setDraft(null)
        }
    }, [activeNoteId, creatingNote]);


    const value = {
        creatingNote,
        setCreatingNote,

        editingNote,
        setEditingNote,

        activeNoteId,
        setActiveNoteId,

        notes,

        draft,
        setDraft,

        isMakingFolder,
        setIsMakingFolder,

        isSearching,
        setIsSearching,

        folders,

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