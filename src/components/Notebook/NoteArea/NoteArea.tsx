import { useNotebook } from "../NotebookContext";
import NoteAreaIdle from "./NoteAreaIdle";
import NoteAreaActive from "./NoteAreaActive";

const NoteArea = () => {
  const {creatingNote, notes} = useNotebook();

  console.log(notes)

  return (
    <div className = "w-full h-full">
      {creatingNote ? 
        <NoteAreaActive/> : <NoteAreaIdle/> 
      }
    </div>
  )
}

export default NoteArea