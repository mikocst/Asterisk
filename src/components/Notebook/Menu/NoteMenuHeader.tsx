import React from 'react'
import { Edit } from 'feather-icons-react'
import { useNotebook } from '../NotebookContext'

const NoteMenuHeader = () => {
  const {setCreatingNote, setActiveNoteId, setDraft} = useNotebook();

  const handleCreateNew = () => {
    setCreatingNote(true);
    setActiveNoteId(null);
    setDraft({
      title: "",
      blocks: [{ id: crypto.randomUUID(), type: "text", content: "" }],
      isFavorited: false,
      folder: "All Notes",
      folderId: null,
      createdAt: Date.now(),
    });
  };

  return (
    <div className = "flex flex-row justify-between items-center">
        <h1 className = "text-xl font-medium">Notes</h1>
        <button 
        onClick={handleCreateNew}
        className = "p-1 rounded-sm border border-gray-400 cursor-pointer bg-white">
            <Edit size={'20px'} className = "text-gray-400"/>
        </button>
    </div>
  )
}

export default NoteMenuHeader