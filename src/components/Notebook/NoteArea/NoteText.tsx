import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useNotebook } from '../NotebookContext';
import { SyncConvexPlugin } from '../Plugins/SyncConvexPlugin';

const NoteText = () => {
  const { draft } = useNotebook();

  const initialConfig = {
    namespace: 'AsteriskEditor',
    onError: (error: Error) => console.error(error),
    theme: {
      paragraph: 'relative m-0 quote mb-2',
      heading: {
        h1: 'text-3xl font-bold mt-6 mb-2',
        h2: 'text-2xl font-semibold mt-4 mb-2',
      },
      list: {
        ul: 'list-disc ml-5',
        ol: 'list-decimal ml-5',
      }
    },
  };

  return (
    <div className="relative w-full h-full mx-auto py-1">
      <LexicalComposer initialConfig={initialConfig}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable 
              className="outline-none min-h-125 px-2 py-4 prose prose-slate max-w-none" 
            />
          }
          placeholder={
            <div className="absolute top-6 left-4 text-gray-400 pointer-events-none">
              Type '/' for commands...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <SyncConvexPlugin />
      </LexicalComposer>
    </div>
  );
};

export default NoteText;