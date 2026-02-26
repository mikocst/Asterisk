import { useNotebook } from '../NotebookContext';

const NoteText = () => {
   const { draft, handleNoteUpdates } = useNotebook();

  return (
    <textarea 
    value = {draft?.content || ""}
    onChange={(e) => handleNoteUpdates('content', e.target.value)}
    placeholder='Click or press ALT + W to begin writing or "/" for commands...' className = "resize-none"/>
  )
}

export default NoteText