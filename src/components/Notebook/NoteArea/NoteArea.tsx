import { useNotebook } from "../NotebookContext";
import NoteAreaIdle from "./NoteAreaIdle";
import NoteAreaActive from "./NoteAreaActive";
import NoteDeletedToast from "./NoteDeletedToast";

const NoteArea = () => {
  const {creatingNote, activeNoteId} = useNotebook();

  const isBusy = creatingNote || activeNoteId !== null;

  return (
    <div className = "w-full h-full relative bg-black/3">
      {isBusy ? 
        <NoteAreaActive/> : <NoteAreaIdle/> 
      }
      <div className = "absolute bottom-2 w-auto p-2 shadow-xl rounded-lg left-1/2 -translate-x-1/2 bg-white border border-black/20">
        <NoteDeletedToast/>
      </div>
    </div>
  )
}

export default NoteArea