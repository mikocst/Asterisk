import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useNotebook } from '../NotebookContext';
import { $getRoot } from 'lexical';

export const SyncConvexPlugin = () => {
  const [editor] = useLexicalComposerContext();
  
  const { handleNoteUpdates } = useNotebook();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const json = editorState.toJSON();
          const plainText = $getRoot().getTextContent();
          
          handleNoteUpdates({ 
            lexicalData: JSON.stringify(json),
            textContent: plainText 
          });
        });
      }}
    />
  );
};