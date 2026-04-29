import { useNotebook } from '../NotebookContext';
import { useState, useRef, useEffect } from 'react';
import TextAreaMenu from './TextAreaMenu';
import TextBlock from './TextBlock';
import type { Blocktype } from '../types';

const NoteText = () => {
    const { draft, activeNoteId, handleBlockUpdate, handleBlockSplit, handleBlockMerge, handleNoteUpdates } = useNotebook();
    const [menuState, setMenuState] = useState<{ index: number; top: number; left: number } | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<{ index: number; position: number } | null>(null);
    const [multiSelectRange, setMultiSelectRange] = useState<{start: number; end: number} | null>(null)

    const handleCommand = (commandValue: string) => {
        if (!activeNoteId || !draft?.blocks || !menuState) return;

        const targetBlock = draft.blocks[menuState.index];
        const formatTypes: Blocktype[] = ['h1', 'h2', 'h3', 'text'];
        const isFormat = formatTypes.includes(commandValue as Blocktype);

        handleBlockUpdate(activeNoteId, targetBlock.id, {
            type: isFormat ? (commandValue as Blocktype) : targetBlock.type,
            content: targetBlock.content.replace('/', '')
        });

        setMenuState(null);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>, index: number) => {

    if(multiSelectRange){
      if(e.key === 'Backspace'){
        e.preventDefault();
        deleteSelectedBlocks();
        return;
      }
      setMultiSelectRange(null)
    }

    const caretPosition = e.currentTarget.selectionStart;
    const isAtStart = caretPosition === 0;

    const isAllTextSelected = 
        e.currentTarget.selectionStart === 0 && 
        e.currentTarget.selectionEnd === e.currentTarget.value.length &&
        e.currentTarget.value.length > 0;

    if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        if (e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === e.currentTarget.value.length) {
            e.preventDefault();
            setMultiSelectRange({ start: 0, end: draft!.blocks.length - 1 });
            return; 
        }
    }

    if(e.key === 'Backspace' && isAllTextSelected){
      e.preventDefault();

      const updatedBlocks = draft!.blocks.filter((_, i) => i !== index);
      const finalBlocks = updatedBlocks.length === 0 
            ? [{ id: crypto.randomUUID(), type: 'text' as Blocktype, content: '' }] 
            : updatedBlocks;

      handleNoteUpdates('blocks', finalBlocks);

      const newIndex = Math.max(0, index - 1);
      setFocusedIndex({ 
            index: newIndex, 
            position: draft!.blocks[newIndex].content.length 
        });

      return;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        handleBlockSplit(index, caretPosition);
        setFocusedIndex({ index: index + 1, position: 0 });
    } 
    else if (e.key === 'Backspace' && isAtStart && index > 0 ) {
        e.preventDefault();
        const previousBlockContent = draft?.blocks[index - 1].content || "";

        handleBlockMerge(index);

        setFocusedIndex({
          index: index - 1,
          position: previousBlockContent.length
        })
    }
};

const deleteSelectedBlocks = () => {
  if (!multiSelectRange || !activeNoteId || !draft) return;

  const {start, end } = multiSelectRange;
  const min = Math.min(start,end);
  const max = Math.max(start,end);

  let updatedBlocks = draft.blocks.filter((_,i) => i < min || i > max);

  const finalBlocks = updatedBlocks.length === 0 ? 
                      [{ id: crypto.randomUUID(), type: 'text' as Blocktype, content: '' }]
                        : updatedBlocks;

  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }

  handleNoteUpdates('blocks', finalBlocks);
  setMultiSelectRange(null);
  setTimeout(() => {
     setFocusedIndex({ index: 0, position: 0 });
  }, 10);
}

    return (
        <div className="relative w-full h-full mx-auto py-2">
            {draft?.blocks.map((block, index) => {
              const isSelected = multiSelectRange 
              ? index >= Math.min(multiSelectRange.start, multiSelectRange.end) && 
                index <= Math.max(multiSelectRange.start, multiSelectRange.end)
              : false;

              return(
                    <TextBlock
                    key={block.id}
                    index={index}
                    block={block}
                    focusedIndex={focusedIndex}
                    isSelected = {isSelected}
                    onTriggerMenu={(coords) => setMenuState({ index, ...coords })}
                    onCloseMenu={() => setMenuState(null)}
                    onUpdate={(idx, contentValue) => { 
                      if (!activeNoteId) return;
                      handleBlockUpdate(activeNoteId, block.id, { content: contentValue });
                    }}
                    onKeyDown={handleKeyDown}
                />
              )
            })}

            {menuState && (
                <TextAreaMenu
                    onSelect={handleCommand}
                    positionTop={menuState.top}
                    positionLeft={menuState.left}
                />
            )}
        </div>
    );
};

export default NoteText;