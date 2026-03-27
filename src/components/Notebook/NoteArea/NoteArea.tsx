import { useNotebook } from "../NotebookContext";
import NoteAreaIdle from "./NoteAreaIdle";
import NoteAreaActive from "./NoteAreaActive";
import NoteDeletedToast from "./NoteDeletedToast";
import { AnimatePresence, motion, time } from "motion/react";

const NoteArea = () => {
  const {creatingNote, activeNoteId, showToast} = useNotebook();

  const isBusy = creatingNote || activeNoteId !== null;

  return (
    <div className = "w-full h-full relative bg-black/3">
      {isBusy ? 
        <NoteAreaActive/> : <NoteAreaIdle/> 
      }
      <AnimatePresence>
        {showToast &&
        <motion.div
          initial = {{opacity: 0, y: 50}}
          animate = {{opacity: 1, y: 0}}
          exit = {{opacity: 0, y: 20}}
          transition = {{duration: 0.2}}
          className = "absolute bottom-2 w-auto p-2 shadow-xl rounded-lg left-1/2 -translate-x-1/2 bg-white border border-black/20"
        >
            <NoteDeletedToast/>
        </motion.div>
        }
      </AnimatePresence>
    </div>
  )
}

export default NoteArea