import CreatedNoteDate from "./CreatedNoteDate";
import SelectingNoteFolder from "./SelectingNoteFolder";
import NoteText from "./NoteText";
import { useNotebook } from "../NotebookContext";
import { useEffect, useRef } from "react";
import { ArrowLeft, Star, Trash } from "feather-icons-react";

const NoteAreaActive = () => {
  const { handleWriting, draft, handleNoteUpdates, setCreatingNote, handleDeleteNote, setActiveNoteId, activeNoteId, handleNoteFavorite} = useNotebook();

  const draftRef = useRef(handleWriting);
  draftRef.current = handleWriting;

  const handleBackClick = () => {
    setCreatingNote(false)
    setActiveNoteId(null)
  }

  useEffect(() => {
      return () => {draftRef.current()}
  },[])

  return (
    <div
    className = "h-full w-full flex flex-col gap-2 p-8 justify-start">
        <div className = "h-auto w-full flex justify-between items-center">
          <button 
            onClick = {() => handleBackClick()}
            className = "mb-2 cursor-pointer w-8 pt-1 pr-1 pb-1">
            <ArrowLeft className = "text-gray-500"/>
          </button>
          <div className = "flex flex-row gap-2 items-center">
            <button 
              onClick = {() => {
                handleNoteFavorite(activeNoteId || "")
              }}
              className = "mb-2 cursor-pointer w-8 pt-1 pr-1 pb-1">
              <Star className={draft?.isFavorited ? "text-yellow-400" : "text-gray-500"} 
              fill={draft?.isFavorited ? "currentColor" : "none"}/>
            </button>
            <button 
              onClick={() => {
                if(activeNoteId) {
                  handleDeleteNote(activeNoteId)
              }
            }}
              className = "mb-2 cursor-pointer w-8 pt-1 pr-1 pb-1">
              <Trash className = "text-red-400"/>
            </button>
          </div>
        </div>
        <textarea placeholder="New Note"
        className = "resize-none text-xl h-8 w-full"
        value = {draft?.title || ""}
        onChange={(e) => handleNoteUpdates('title', e.target.value)}
        />
        <div className = "flex flex-col gap-2 pb-4 border-b border-gray-200">
            <CreatedNoteDate/>
            <SelectingNoteFolder/>
        </div>
        <NoteText />
    </div>
  )
}

export default NoteAreaActive