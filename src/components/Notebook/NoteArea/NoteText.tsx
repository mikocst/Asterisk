import { useNotebook } from '../NotebookContext';
import { useState, useRef, useEffect } from 'react';

const NoteText = () => {
   const { handleNoteUpdates, draft } = useNotebook();

   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
   const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
   const [textBeforeCursor, setTextBeforeCursor] = useState<string | undefined>(undefined)

   const textAreaRef = useRef(null);
   const caretRef = useRef(null);

   const handleCaretTracking = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const index = e.target.selectionStart;
      const updatedValue = value[index-1];

      if(updatedValue === "/"){
        setTextBeforeCursor(value.slice(0, index-1));
      }

   }

  return (
    <div className = "relative w-full h-full">
      <textarea 
      id = "note-body-area"
      value = {draft?.content || ""}
      onChange={(e) => {
        handleNoteUpdates('content', e.target.value)
        handleCaretTracking(e)
      }}
      ref = {textAreaRef}
      placeholder='Click or press ALT + W to begin writing or "/" for commands...' 
      className = "w-full h-full p-2 resize-none relative z-20"
      />
      <div className = "absolute top-0 left-0 opacity-0 w-full h-full p-2 whitespace-pre-wrap wrap-break-word pointer-none z-10"
      >
        <span>{textBeforeCursor}</span>
        <span id = "caret-locator"
        ref={caretRef}
        >
          /
        </span>
      </div>
    </div>
  )
}

export default NoteText