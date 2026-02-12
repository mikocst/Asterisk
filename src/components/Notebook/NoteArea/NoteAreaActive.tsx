import { Clock, Folder } from "feather-icons-react";
import CreatedNoteDate from "./CreatedNoteDate";
import SelectingNoteFolder from "./SelectingNoteFolder";

const NoteAreaActive = () => {
  return (
    <div className = "h-full w-full flex flex-col justify-center gap-4 p-8">
        <textarea placeholder="New Note" className = "resize-none text-xl h-8 w-full"/>
        <CreatedNoteDate/>
        <SelectingNoteFolder/>
    </div>
  )
}

export default NoteAreaActive