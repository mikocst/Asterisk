import { useNotebook } from "../NotebookContext";
import NoteAreaIdle from "./NoteAreaIdle";
import NoteAreaActive from "./NoteAreaActive";

const NoteArea = () => {
  const {creatingNote, setCreatingNote} = useNotebook();

  return (
    <div className = "w-full h-full">
      <NoteAreaActive/>
    </div>
  )
}

export default NoteArea