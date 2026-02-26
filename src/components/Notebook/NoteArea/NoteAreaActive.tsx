import CreatedNoteDate from "./CreatedNoteDate";
import SelectingNoteFolder from "./SelectingNoteFolder";
import NoteText from "./NoteText";
import { useNotebook } from "../NotebookContext";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "feather-icons-react";

const NoteAreaActive = () => {
  const {notes, handleWriting, draft, handleNoteUpdates, setCreatingNote, activeNoteId, setActiveNoteId} = useNotebook();

  const draftRef = useRef(handleWriting);
  draftRef.current = handleWriting;

  const selectedNote = notes.find((note) => note.id === activeNoteId);
  const currentNoteData = selectedNote || draft

  console.log(activeNoteId, notes)

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
        <button 
        onClick = {() => handleBackClick()}
        className = "mb-2 cursor-pointer w-8 pt-1 pr-1 pb-1">
          <ArrowLeft className = "text-gray-500"/>
        </button>
        <textarea placeholder="New Note"
        className = "resize-none text-xl h-8 w-full"
        value = {currentNoteData?.title}
        onChange={(e) => handleNoteUpdates('title', e.target.value)}
        />
        <div className = "flex flex-col gap-2 pb-4 border-b border-gray-200">
            <CreatedNoteDate/>
            <SelectingNoteFolder/>
        </div>
        <NoteText/>
    </div>
  )
}

export default NoteAreaActive