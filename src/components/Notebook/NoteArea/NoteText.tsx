import { useNotebook } from '../NotebookContext';
import { useState, useRef, useEffect } from 'react';
import TextAreaMenu from './TextAreaMenu';
import TextBlock from './TextBlock';
import type { Blocktype } from '../types';

const NoteText = () => {
    const { draft, activeNoteId, handleBlockUpdate, handleBlockSplit, handleBlockMerge } = useNotebook();
    const [menuState, setMenuState] = useState<{ index: number; top: number; left: number } | null>(null);
    const [focusedIndex, setFocusedIndex] = useState<{ index: number; position: number } | null>(null);

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
    const caretPosition = e.currentTarget.selectionStart;

    if (e.key === 'Enter') {
        e.preventDefault();
        handleBlockSplit(index, caretPosition);
        setFocusedIndex({ index: index + 1, position: 0 });
    } 
    else if (e.key === 'Backspace' && caretPosition === 0 && index > 0) {
        e.preventDefault();
        const previousBlockContent = draft?.blocks[index - 1].content || "";
        handleBlockMerge(index);
        setFocusedIndex({ index: index - 1, position: previousBlockContent.length });
    }
};

    return (
        <div className="relative w-full h-full mx-auto py-2">
            {draft?.blocks.map((block, index) => (
                <TextBlock
                    key={block.id}
                    index={index}
                    block={block}
                    focusedIndex={focusedIndex}
                    onTriggerMenu={(coords) => setMenuState({ index, ...coords })}
                    onCloseMenu={() => setMenuState(null)}
                    onUpdate={(idx, contentValue) => { 
                      if (!activeNoteId) return;
                      handleBlockUpdate(activeNoteId, block.id, { content: contentValue });
                    }}
                    onKeyDown={handleKeyDown}
                />
            ))}

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