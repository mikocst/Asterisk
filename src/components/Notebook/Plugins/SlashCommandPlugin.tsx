import { useCallback, useEffect, useRef, useState } from "react"
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, COMMAND_PRIORITY_BEFORE_LOW, KEY_DOWN_COMMAND, $isRangeSelection } from "lexical";
import TextAreaMenu from "../NoteArea/TextAreaMenu";
import { transformToBulletedList, transformToH1 } from "./TransformTextPlugin";
import type { SlashMenuItem } from "../types";

export const SlashCommandPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [coords, setCoords] = useState<{x: number, y:number} | null>(null);
    const [query, setQuery] = useState<string>("");
    const coordsRef = useRef(coords);
    coordsRef.current = coords;

    const handleSelect = useCallback((type: SlashMenuItem) => {
        editor.focus();

        editor.update(() => {
            const selection = $getSelection();

            if($isRangeSelection(selection) && selection.isCollapsed()) {
                const deleteCount = query.length + 1;

                for (let i = 0; i < deleteCount; i++){
                    selection.deleteCharacter(true);
                }
            }

            if(type === "h1") transformToH1(editor);

            else if(type === 'bullet') transformToBulletedList(editor);
        });
        setCoords(null);
        setQuery("");
    },[editor, query]);

    useEffect(() => {
        const unregister = editor.registerCommand(
            KEY_DOWN_COMMAND, (event: KeyboardEvent) => {
                const {key} = event

                if(key === "/") {
                    const domSelection = window.getSelection();
                    if (domSelection && domSelection.rangeCount > 0) {
                        const range = domSelection.getRangeAt(0);
                        const rect = range.getBoundingClientRect();
                        setCoords({x: rect.left, y: rect.top + 24})
                    }
                    setQuery("")
                    return false;
                }

               if(coordsRef.current !== null) {
                 if (key === "Escape" || event.key === " "){
                    setCoords(null);
                    setQuery("");
                    return key === "Escape"
                }

                if (key === "Backspace"){
                    if(query.length === 0) {
                        setCoords(null)
                    }
                    else {
                        setQuery((prev) => prev.slice(0, -1))
                    }
                    return false
                }

                if(key.length === 1) {
                    setQuery((prev) => prev + key)
                    return false
                }
               }

                return false
            },
            COMMAND_PRIORITY_BEFORE_LOW
        );
        return () => unregister();
    }, [editor, handleSelect]);

    return (
        <>
            {coords && (
                <TextAreaMenu
                positionTop = {coords.y}
                positionLeft = {coords.x}
                onSelect = {handleSelect}
                query = {query}
                />
            )}
        </>
    )
}