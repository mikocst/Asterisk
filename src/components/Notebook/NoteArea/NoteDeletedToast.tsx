import { useNotebook } from "../NotebookContext"

const NoteDeletedToast = () => {

  const {lastDeletedNote, handleUndo} = useNotebook();

  return (
    <div className = "flex flex-row gap-4 w-auto items-center">
      <div className = "flex flex-col gap-1">
        <p className = "font-medium"> Note {lastDeletedNote?.title} moved to trash</p>
        <p className = "text-gray-500 text-md">Dummy date</p>
      </div>
      <button
        onClick={handleUndo}
        className = "bg-black text-white h-auto p-2 rounded-lg cursor-pointer"
        >
        Undo
      </button>
    </div>
  )
}

export default NoteDeletedToast