import { useNotebook } from '../NotebookContext';
import { useState, useRef, useEffect } from 'react';
import TextAreaMenu from './TextAreaMenu';
import TextBlock from './TextBlock';
import type { Blocktype } from '../types';

const NoteText = () => {
    const { draft, activeNoteId, handleBlockUpdate, handleBlockSplit, handleBlockMerge, handleNoteUpdates } = useNotebook();

    const [menuState, setMenuState] = useState<{ index: number; top: number; left: number } | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<{ index: number; position: number } | null>(null);
    const [multiSelectRange, setMultiSelectRange] = useState<{start: number; end: number} | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

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
    const { selectionStart, selectionEnd } = e.currentTarget;

    if (multiSelectRange) {
        if (e.key === 'Backspace') {
            e.preventDefault();
            deleteSelectedBlocks();
            return;
        }
        
        if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Meta') {
            setMultiSelectRange(null);
        }
    }

    if (e.key === 'Backspace' && selectionStart === 0 && selectionEnd === 0 && index > 0) {
        e.preventDefault();
        const previousContent = draft?.blocks[index - 1].content || "";
        handleBlockMerge(index);
        setFocusedIndex({
            index: index - 1,
            position: previousContent.length
        });
        return;
    }

    if (e.key === 'Enter') {
        e.preventDefault();
        handleBlockSplit(index, selectionStart);
        setFocusedIndex({ index: index + 1, position: 0 });
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
      const newIndex = Math.max(0, min - 1);
      setTimeout(() => {
            setFocusedIndex({ index: newIndex, position: 0 });
          }, 10);
    };

    const handleDragStart = (index: number, e:React.MouseEvent) => {
      if(e.target === e.currentTarget || e.shiftKey){
        e.preventDefault()
        setIsDragging(true);
        setMultiSelectRange({start: index, end: index})
      }

      else {
        setIsDragging(false)
        setMultiSelectRange(null)
      }
    };

    const handleDragEnter = (index: number) => {
      if(!isDragging || !multiSelectRange) return;

      setMultiSelectRange({...multiSelectRange, end: index});
    };

    const handleDragEnd = () => {
      setIsDragging(false)
    };

    useEffect(() => {
      const handleGlobalMouseUp = () => setIsDragging(false);
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }, []);

    return (
        <div className={`relative w-full h-full mx-auto py-2 ${isDragging ? 'select-none' : ''}`}
        onMouseUp = {handleDragEnd}
        onMouseLeave = {handleDragEnd}
        onMouseDown={(e) => {
          if(e.target === e.currentTarget) {
            setMultiSelectRange(null)
          }
        }}
        >
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
                    isDragging = {isDragging}
                    onTriggerMenu={(coords) => setMenuState({ index, ...coords })}
                    onCloseMenu={() => setMenuState(null)}
                    onUpdate={(idx, contentValue) => { 
                      if (!activeNoteId) return;
                      handleBlockUpdate(activeNoteId, block.id, { content: contentValue });
                    }}
                    onKeyDown={handleKeyDown}
                    onMouseDown = {(e) => handleDragStart(index, e)}
                    onMouseEnter = {() => handleDragEnter(index)}
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