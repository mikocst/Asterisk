import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { useNotebook } from '../NotebookContext';

export const SyncConvexPlugin = () => {
  const [editor] = useLexicalComposerContext();
  
  const { handleNoteUpdates } = useNotebook();

  return (
    <OnChangePlugin
      onChange={(editorState) => {
        editorState.read(() => {
          const json = editorState.toJSON();
          
          handleNoteUpdates({ 
            lexicalData: JSON.stringify(json) 
          });
        });
      }}
    />
  );
};