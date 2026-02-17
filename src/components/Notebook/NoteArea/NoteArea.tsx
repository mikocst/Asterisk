import { useNotebook } from "../NotebookContext";
import NoteAreaIdle from "./NoteAreaIdle";
import NoteAreaActive from "./NoteAreaActive";

const NoteArea = () => {
  const {creatingNote} = useNotebook();

  return (
    <div className = "w-full h-full">
      {creatingNote ? 
        <NoteAreaActive/> : <NoteAreaIdle/> 
      }
    </div>
  )
}

export default NoteArea