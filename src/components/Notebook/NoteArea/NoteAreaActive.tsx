import CreatedNoteDate from "./CreatedNoteDate";
import SelectingNoteFolder from "./SelectingNoteFolder";
import NoteText from "./NoteText";
import { useNotebook } from "../NotebookContext";
import { useEffect, useRef } from "react";

const NoteAreaActive = () => {
  const {handleDraft, notes, draft, handleUpdateDraft} = useNotebook();

  const draftRef = useRef(handleDraft);
  draftRef.current = handleDraft;

  useEffect(() => {
      return () => {draftRef.current()}
  },[])

  return (
    <div
    className = "h-full w-full flex flex-col justify-center gap-2 p-8">
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