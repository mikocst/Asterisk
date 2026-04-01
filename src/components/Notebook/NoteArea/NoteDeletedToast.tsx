import { useNotebook } from "../NotebookContext"

interface ToastDetails {
  title: string;
  id: string
}

const NoteDeletedToast = ({title, id}:ToastDetails) => {

  const { handleUndo} = useNotebook();

  return (
    <div className = "flex flex-row justify-between w-auto items-center">
      <div className = "flex flex-col gap-1">
        <p className = "font-medium"> Note {title} moved to trash</p>
        <p className = "text-gray-500 text-md">Dummy date</p>
      </div>
      <button
        onClick={() => handleUndo(id)}
        className = "bg-black text-white h-auto p-2 rounded-lg cursor-pointer"
        >
        Undo
      </button>
    </div>
  )
}

export default NoteDeletedToast