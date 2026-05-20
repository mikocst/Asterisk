import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useRef, useEffect } from 'react';
import { 
    KEY_TAB_COMMAND,
    KEY_ESCAPE_COMMAND,
    COMMAND_PRIORITY_CRITICAL,
    INDENT_CONTENT_COMMAND,
    $getSelection,
    $isRangeSelection,
} from 'lexical';

import { mergeRegister, $getNearestNodeOfType } from '@lexical/utils';
import {ListItemNode} from '@lexical/list'

export const TabEscapePlugin = () => {
    const [editor] = useLexicalComposerContext();
    const isEscapeHatchActive = useRef<boolean>(false);

  useEffect(() => {
    return(
        mergeRegister(
            editor.registerCommand(KEY_ESCAPE_COMMAND, () => {
                isEscapeHatchActive.current = true
                return false
            }, COMMAND_PRIORITY_CRITICAL) 
        )
    )
  }, [editor])

    return (
        <>
        </>
    )
}