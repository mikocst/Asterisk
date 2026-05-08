import { useEffect, useState } from "react"
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, COMMAND_PRIORITY_BEFORE_LOW, KEY_DOWN_COMMAND, $isRangeSelection } from "lexical";
import TextAreaMenu from "../NoteArea/TextAreaMenu";

export const SlashCommandPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [coords, setCoords] = useState<{x: number, y:number} | null>(null);

    useEffect(() => {
        const unregister = editor.registerCommand(
            KEY_DOWN_COMMAND, (event: KeyboardEvent) => {
                if(event.key === "/") {
                    const domSelection = window.getSelection();
                    if (domSelection && domSelection.rangeCount > 0) {
                        const range = domSelection.getRangeAt(0);
                        const rect = range.getBoundingClientRect();
                        setCoords({x: rect.left, y: rect.top + 24})
                    }

                }
                else if (event.key === "Escape"){
                    setCoords(null);
                }

                return false
            },
            COMMAND_PRIORITY_BEFORE_LOW
        );
        return () => unregister();
    }, [editor]);

    return (
        <>
            {coords && (
                <TextAreaMenu
                positionTop = {coords.y}
                positionLeft = {coords.x}
                onSelect = {(type) => {
                    editor.focus();
                    editor.update(() => {
                       const selection = $getSelection();

                       if($isRangeSelection(selection)){
                        selection.deleteCharacter(true)
                       }
                    });
                    setCoords(null)
                }}
                />
            )}
        </>
    )
}