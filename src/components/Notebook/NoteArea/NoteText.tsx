import { useNotebook } from '../NotebookContext';
import { useState, useRef, useEffect } from 'react';
import TextAreaMenu from './TextAreaMenu';

const NoteText = () => {
   const { handleNoteUpdates, draft } = useNotebook();

   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
   const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
   const [textBeforeCursor, setTextBeforeCursor] = useState<string | undefined>(undefined)

   const textAreaRef = useRef<HTMLTextAreaElement>(null);
   const caretRef = useRef<HTMLSpanElement>(null);

   const handleCaretTracking = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputType = (e.nativeEvent as InputEvent).inputType
      const value = e.target.value;
      const index = e.target.selectionStart;
      const updatedValue = value[index-1];

      if(updatedValue === "/" && inputType === "insertText"){
        setTextBeforeCursor(value.slice(0, index-1));
      }
      
      else if(updatedValue === " " || inputType === "deleteContentBackward"){
        setIsMenuOpen(false)
        setTextBeforeCursor(undefined)
      }

      else {
        return
      }
   }

   const handleCommand = (symbol: string) => {
      if(!textAreaRef.current || !draft?.blocks) return

      const textValue = textAreaRef.current.value;
      const textIndex = textAreaRef.current.selectionStart;
      
      if(typeof textIndex === "number"){
        const beforeSlashText = textValue.slice(0, textIndex - 1);
        const afterSlashText  = textValue.slice(textIndex);
        const newContent = beforeSlashText + symbol + afterSlashText

        const updatedBlocks = [...draft.blocks];

        if (updatedBlocks.length > 0 ) {
          updatedBlocks[0] = {...updatedBlocks[0], content: newContent};
          handleNoteUpdates('blocks', updatedBlocks)
        }

        const newCursorPosition = beforeSlashText.length + symbol.length;
        setTimeout(() => {
          if(textAreaRef.current) {
            textAreaRef.current.focus()
            textAreaRef.current.setSelectionRange(newCursorPosition, newCursorPosition)
          }
        })

        setIsMenuOpen(false)
      }
   }
   
   useEffect(() => {
    if(textBeforeCursor === undefined) {
      return
    }

    else{ 
      if(caretRef.current && textAreaRef.current){
      const topCoord = caretRef?.current?.offsetTop
      const leftCoord = caretRef?.current?.offsetLeft
      const scrollOffset = textAreaRef?.current?.scrollTop
      const finalTopPosition = topCoord - scrollOffset + 25;

      setIsMenuOpen(true);  
      setMenuPosition({top: finalTopPosition, left: leftCoord})
      }
    }
   }, [textBeforeCursor])

  return (
    <div className = "relative w-full h-full">
      <textarea 
      id = "note-body-area"
      value = {draft?.blocks?.[0]?.content || ""}
      onChange={(e) => {
        if(draft?.blocks){
          const updatedBlocks = [...draft.blocks]
          updatedBlocks[0] = {...updatedBlocks[0], content: e.target.value}
        }
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
      {isMenuOpen && (
        <div>
          <TextAreaMenu
          onSelect = {handleCommand}
          positionTop={menuPosition.top}
          positionLeft={menuPosition.left}
          />
        </div>
      )}
    </div>
  )
}

export default NoteText