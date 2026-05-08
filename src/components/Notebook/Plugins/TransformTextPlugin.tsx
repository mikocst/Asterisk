import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from '@lexical/list';
import type { LexicalEditor } from 'lexical';

export const transformToH1 = (editor : LexicalEditor) => {
    
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createHeadingNode('h1'));
    }
  });
};


export const transformToBulletedList = (editor : LexicalEditor) => {
  editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
};