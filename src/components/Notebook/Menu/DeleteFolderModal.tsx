import { easeOut, motion } from "motion/react"
import { X } from "feather-icons-react"
import { useEffect } from "react"

interface DeleteFolderModalProps {
    isOpen: boolean,
    onClose: () => void,
    onConfirm: () => void,
    folderName: string,
    noteCount: number
}

const DeleteFolderModal = ({isOpen, onClose, onConfirm, folderName, noteCount}: DeleteFolderModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose()
        };
    }

    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = 'unset'
    }
}, [onClose])

  return (
    <motion.div
    initial = {{opacity: 0}}
    animate = {{opacity: 1}}
    exit = {{opacity: 0}}
    transition = {{ease: easeOut, duration: 0.2}}
    className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick = {() => onClose()}
    >
        <motion.div
        initial = {{opacity: 0, scale: 0.95}}
        animate = {{opacity: 1, scale: 1}}
        exit = {{opacity: 0, scale: 0.95}}
        transition = {{ease:easeOut, duration: 0.2}}
        onClick = {(e:React.MouseEvent) => e.stopPropagation()}
        className = "flex flex-col gap-2 items-center bg-white p-4 max-w-md w-full rounded-md"
        >
            <div className = "flex flex-row justify-between items-center w-full">
                <h2>Are you sure you want to delete folder<span>{folderName}</span>?</h2>
                <X
                onClick = {() => onClose()}
                size = {`20px`} 
                className = "text-gray-500 cursor-pointer border border-gray-300 rounded-sm hover:bg-gray-100 text-lg"
                />
            </div>
            <p className = "text-gray-500 text-md">
                Folder {folderName} currently contains {noteCount} notes. By deleting this folder, these notes will also be deleted.</p>
            <div className = "w-full flex flex-row gap-2 justify-end">
                <button
                 onClick = {() => onClose()}
                 className = "border border-gray-400 text-gray-500 rounded-md px-2 py-1 cursor-pointer hover:bg-gray-100"
                 >
                    Cancel
                </button
                 >
                <button 
                onClick = {() => onConfirm()}
                className = "border border-red-500 text-red-500 rounded-md px-2 py-1 cursor-pointer hover:bg-red-50"
                >
                    Confirm
                </button>
            </div>
        </motion.div>
    </motion.div>
  )
}

export default DeleteFolderModal