import { useNotebook } from '../NotebookContext';
import { useState, useRef, useEffect } from 'react';
import TextAreaMenu from './TextAreaMenu';
import TextBlock from './TextBlock';
import type { Blocktype } from '../types';

const NoteText = () => {
   const { handleNoteUpdates, draft, handleBlockUpdate, activeNoteId, handleBlockSplit, handleBlockMerge } = useNotebook();

   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
   const [menuPosition, setMenuPosition] = useState({top: 0, left: 0});
   const [textBeforeCursor, setTextBeforeCursor] = useState<string | undefined>(undefined);
   const [focusedIndex, setFocusedIndex] = useState<{index:number; position:number }| null>(null)

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

const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {
    const caretPosition = e.currentTarget.selectionStart;

    if (e.key === 'Enter') {
      e.preventDefault();

      handleBlockSplit(index, caretPosition);

      setFocusedIndex({index: index + 1, position: 0});
    }

    else if(e.key === 'Backspace' && caretPosition === 0 && index > 0) {
      e.preventDefault();

      const previousBlockContent = draft?.blocks[index - 1].content || "";
      const endOfPreviousBlock = previousBlockContent.length;

      handleBlockMerge(index)

      setFocusedIndex({index: index - 1, position: endOfPreviousBlock})
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
    <div className="relative w-full h-full mx-auto py-2">
    {draft?.blocks.map((block, index) => (
      <TextBlock
        key={block.id}
        index={index}
        block={block}
        focusedIndex={focusedIndex} 
        onUpdate={(idx, content) => {
          const updated = [...draft.blocks];
          updated[idx] = { ...updated[idx], content };
          handleNoteUpdates('blocks', updated);
        }}
        onKeyDown={handleKeyDown}
      />
    ))}
    {isMenuOpen && (
      <TextAreaMenu
        onSelect={handleCommand}
        positionTop={menuPosition.top}
        positionLeft={menuPosition.left}
      />
    )}
  </div>
  )
}

export default NoteText