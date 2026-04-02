import { useNotebook } from "../NotebookContext"
import { useEffect } from "react";

interface ToastDetails {
  title: string;
  id: string
  isHovered: boolean
}

const NoteDeletedToast = ({title, id, isHovered}:ToastDetails) => {

  const { handleUndo, setShowToast} = useNotebook();

  useEffect(() => {
    let timer: number | undefined

    if (isHovered === false) {
      const timer = setTimeout(() => {
      setShowToast(false)
    })
    }

    return () => clearTimeout(timer)
  }, [isHovered])

  return (
    <div className = "flex flex-row justify-between w-auto items-center">
      <div className = "flex flex-col gap-1">
        <p className = "font-medium">{title} moved to trash</p>
        <p className = "text-gray-500 text-md">Dummy date</p>
      </div>
      <button
        onClick={() => handleUndo(id)}
        className = "bg-black text-white h-auto py-1 px-2 rounded-lg cursor-pointer"
        >
        Undo
      </button>
    </div>
  )
}

export default NoteDeletedToast