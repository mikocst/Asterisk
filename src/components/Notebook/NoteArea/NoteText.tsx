import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useNotebook } from '../NotebookContext';
import { SyncConvexPlugin } from '../Plugins/SyncConvexPlugin';
import { SlashCommandPlugin } from '../Plugins/SlashCommandPlugin';
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TabEscapePlugin } from '../Plugins/TabEscapePlugin';

const NoteText = () => {
  const { draft, activeNoteId } = useNotebook();

  const initialConfig = {
    namespace: 'AsteriskEditor',
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
    ],
    editorState: draft?.lexicalData || undefined,
    onError: (error: Error) => console.error(error),
    theme: {
      paragraph: 'relative m-0 quote mb-2',
      heading: {
        h1: 'text-3xl font-bold mb-2',
        h2: 'text-2xl font-semibold mb-2',
        h3: 'text-xl font-medium mb-2'
      },
      list: {
        ul: 'list-disc ml-5',
        ol: 'list-decimal ml-5',
        nested: {listitem: 'list-none'} ,
      }
    },
  };

  return (
    <div 
    className="relative w-full h-full mx-auto py-1"
    >
      <LexicalComposer initialConfig={initialConfig} key = {activeNoteId} >
        <RichTextPlugin
          contentEditable={
            <ContentEditable 
              className="outline-none min-h-125 px-2 py-4 prose prose-slate max-w-none" 
            />
          }
          placeholder={
            <div
            className="absolute top-6 left-4 text-gray-400 pointer-events-none"
            id = "note-body-area"
            >
              Type '/' for commands...
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin/>
        <SlashCommandPlugin/>
        <TabEscapePlugin/>
        <SyncConvexPlugin />
        <HistoryPlugin/>
      </LexicalComposer>
    </div>
  );
};

export default NoteText;