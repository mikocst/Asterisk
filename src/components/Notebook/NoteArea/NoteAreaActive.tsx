import CreatedNoteDate from "./CreatedNoteDate";
import SelectingNoteFolder from "./SelectingNoteFolder";
import NoteText from "./NoteText";
import { useNotebook } from "../NotebookContext";
import { useEffect, useRef } from "react";
import { ArrowLeft } from "feather-icons-react";

const NoteAreaActive = () => {
  const {handleDraft, draft, handleUpdateDraft, setCreatingNote} = useNotebook();

  const draftRef = useRef(handleDraft);
  draftRef.current = handleDraft;

  useEffect(() => {
      return () => {draftRef.current()}
  },[])

  return (
    <div
    className = "h-full w-full flex flex-col gap-2 p-8 justify-start">
        <button 
        onClick = {() => setCreatingNote(false)}
        className = "mb-2 cursor-pointer w-8 pt-1 pr-1 pb-1">
          <ArrowLeft className = "text-gray-500"/>
        </button>
        <textarea placeholder="New Note"
        className = "resize-none text-xl h-8 w-full"
        value = {draft?.title || ""}
        onChange={(e) => handleUpdateDraft('title', e.target.value)}
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