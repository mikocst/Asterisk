import { useNotebook } from '../NotebookContext';
import { useState, useRef, useEffect } from 'react';
import TextAreaMenu from './TextAreaMenu';
import type { Blocktype } from '../types';

const NoteText = () => {
   const { handleNoteUpdates, draft, handleBlockUpdate, activeNoteId } = useNotebook();

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
        setIsMenuOpen(true)
      }
      
      else if(updatedValue === " " || inputType === "deleteContentBackward"){
        setIsMenuOpen(false)
        setTextBeforeCursor(undefined)
      }

      else {
        return
      }
   }

 const handleCommand = (commandValue: string) => {
  if (!activeNoteId || !draft?.blocks || !textAreaRef.current) return;

  const textArea = textAreaRef.current;
  const textValue = textArea.value;
  const textIndex = textArea.selectionStart; 

  const formatTypes: Blocktype[] = ['h1', 'h2', 'h3', 'p'];
  const isFormat = formatTypes.includes(commandValue as Blocktype);

  const slashIndex = textIndex - 1;
  
  const beforeSlash = textValue.slice(0, slashIndex);
  const afterSlash = textValue.slice(textIndex);

  const insertText = isFormat ? "" : commandValue;
  const newContent = beforeSlash + insertText + afterSlash;

  const updatedBlocks = [...draft.blocks];
  updatedBlocks[0] = {
    ...updatedBlocks[0],
    content: newContent,
    type: isFormat ? (commandValue as Blocktype) : updatedBlocks[0].type
  };

  handleNoteUpdates('blocks', updatedBlocks);

  setIsMenuOpen(false);
  setTextBeforeCursor(undefined);

  setTimeout(() => {
    textArea.focus();
    const newPos = slashIndex + insertText.length;
    textArea.setSelectionRange(newPos, newPos);
  }, 0);
};
   
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
      const newValue = e.target.value;

      if (draft?.blocks) {
        const updatedBlocks = [...draft.blocks];
        updatedBlocks[0] = { 
          ...updatedBlocks[0], 
          content: newValue,
          type: updatedBlocks[0].type 
        };
        handleNoteUpdates('blocks', updatedBlocks);
      }

      handleCaretTracking(e);
      }}
      ref = {textAreaRef}
      placeholder='Click or press ALT + W to begin writing or "/" for commands...' 
      className={`w-full h-full p-2 resize-none relative z-20 bg-transparent outline-none ${
        draft?.blocks?.[0]?.type === 'h1' ? 'text-4xl font-bold' : 
        draft?.blocks?.[0]?.type === 'h2' ? 'text-2xl font-semibold' : 
        draft?.blocks?.[0]?.type === 'h3' ? 'text-2xl font-semibold' : 
        'text-base' 
      }`}
      />
      <div className = "absolute top-0 left-0 opacity-0 w-full h-full p-2 whitespace-pre-wrap wrap-break-word pointer-events-none z-10"
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