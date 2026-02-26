import { useNotebook } from "../NotebookContext";
import NoteAreaIdle from "./NoteAreaIdle";
import NoteAreaActive from "./NoteAreaActive";

const NoteArea = () => {
  const {creatingNote, activeNoteId} = useNotebook();

  const isBusy = creatingNote || activeNoteId !== null;

  return (
    <div className = "w-full h-full">
      {isBusy ? 
        <NoteAreaActive/> : <NoteAreaIdle/> 
      }
    </div>
  )
}

export default NoteArea