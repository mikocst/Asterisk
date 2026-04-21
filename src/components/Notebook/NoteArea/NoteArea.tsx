import { useNotebook } from "../NotebookContext";
import NoteAreaIdle from "./NoteAreaIdle";
import NoteAreaActive from "./NoteAreaActive";
import NoteDeletedToast from "./NoteDeletedToast";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const NoteArea = () => {
  const {creatingNote, activeNoteId, deletedNotes} = useNotebook();

  const isBusy = creatingNote || activeNoteId !== null;
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className = "w-full h-full relative bg-black/3">
      {isBusy ? 
        <NoteAreaActive/> : <NoteAreaIdle/> 
      }
      <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-20 z-50" 
      >
        <AnimatePresence>
          {deletedNotes.map((note, index) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: isHovered ? index * -100: index * -8,
                scale: isHovered ? 1 : 1 - index * 0.05,
                zIndex: deletedNotes.length - index,
              }}
              transition = {{ease: "easeOut", duration: 0.2}}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
              className="absolute bottom-0 w-full p-4 bg-white border border-black/10 shadow-2xl rounded-xl"
            >
              <NoteDeletedToast
              title={note.title}
              id={note.id} 
              isHovered = {isHovered}
              index = {index}
              deletedAt = {note.deletedAt}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default NoteArea