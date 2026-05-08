import { $createHeadingNode,type HeadingTagType } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import { $getSelection, $isRangeSelection } from 'lexical';
import { $createListNode } from '@lexical/list';
import type { LexicalEditor } from 'lexical';

export const transformToHeading = (editor: LexicalEditor, tag: HeadingTagType) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createHeadingNode(tag));
    }
  });
};

export const transformToBulletedList = (editor: LexicalEditor) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $setBlocksType(selection, () => $createListNode("bullet"));
    }
  });
};

export const transformToH1 = (editor: LexicalEditor) => transformToHeading(editor, 'h1');
export const transformToH2 = (editor: LexicalEditor) => transformToHeading(editor, 'h2');
export const transformToH3 = (editor: LexicalEditor) => transformToHeading(editor, 'h3');