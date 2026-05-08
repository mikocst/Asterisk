import { useCallback, useEffect, useRef, useState } from "react"
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getSelection, COMMAND_PRIORITY_BEFORE_LOW, KEY_DOWN_COMMAND, $isRangeSelection } from "lexical";
import TextAreaMenu from "../NoteArea/TextAreaMenu";
import { transformToBulletedList, transformToH1, transformToH2, transformToH3 } from "./TransformTextPlugin";
import type { SlashMenuItem } from "../types";
import { options } from "./constants";
import type { LexicalEditor } from "lexical";

export const SlashCommandPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [coords, setCoords] = useState<{x: number, y:number} | null>(null);
    const [query, setQuery] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const TRANSFORMERS: Record<string, (editor: LexicalEditor) => void> = {
            h1: transformToH1,
            h2: transformToH2,
            h3: transformToH3,
            bullet: transformToBulletedList,
            };

    const coordsRef = useRef(coords);
    coordsRef.current = coords;

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
    );
    const optionsRef = useRef(filteredOptions);
    optionsRef.current = filteredOptions;

    const indexRef = useRef(selectedIndex);
    indexRef.current = selectedIndex

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

            const transformer = TRANSFORMERS[type];
            if(transformer){
                transformer(editor);
            }
        });
        setCoords(null);
        setQuery("");
    },[editor, query]);

    useEffect(() => {
        const unregister = editor.registerCommand(
            KEY_DOWN_COMMAND, (event: KeyboardEvent) => {
                const {key} = event

                if(key === "/") {
                    setTimeout(() => {
                        const domSelection = window.getSelection();
                        if(domSelection && domSelection.rangeCount > 0) {
                            const range = domSelection.getRangeAt(0);
                            const rect = range.getBoundingClientRect();
                            const editorRoot = editor.getRootElement();
                            const parentRect = editorRoot?.parentElement?.getBoundingClientRect();
                            
                            if (parentRect) {
                            setCoords({
                                x: rect.left - parentRect.left,
                                y: rect.top - parentRect.top + 28 
                            });
                        }
                      }
                    }, 0)
                    setQuery("");
                    return false;
                }

               if(coordsRef.current !== null) {

                  if (key === "Enter") {
                    const selectedOption = optionsRef.current[indexRef.current];
                    if (selectedOption) {
                        event.preventDefault();
                        handleSelect(selectedOption.value);
                        return true; 
                        }
                }

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

                if (key === "ArrowDown") {
                    event.preventDefault();
                    setSelectedIndex((prev) => (prev + 1) % filteredOptions.length);
                    return true; 
                }

                if (key === "ArrowUp") {
                    event.preventDefault();
                    setSelectedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
                    return true; 
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

    useEffect(() => {
         setSelectedIndex(0)
      }, [query])

    return (
        <>
            {coords && (
                <TextAreaMenu
                positionTop = {coords.y}
                positionLeft = {coords.x}
                onSelect = {handleSelect}
                query = {query}
                selectedIndex={selectedIndex}
                filteredOptions={filteredOptions}
                />
            )}
        </>
    )
}