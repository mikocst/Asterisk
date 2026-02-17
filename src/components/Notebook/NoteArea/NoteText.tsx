import { useNotebook } from '../NotebookContext';

const NoteText = () => {
   const { draft, handleUpdateDraft } = useNotebook();

  return (
    <textarea 
    value = {draft?.content || ""}
    onChange={(e) => handleUpdateDraft('content', e.target.value)}
    placeholder='Click or press ALT + W to begin writing or "/" for commands...' className = "resize-none"/>
  )
}

export default NoteText