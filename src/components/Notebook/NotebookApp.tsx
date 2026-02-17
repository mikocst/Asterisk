import { useEffect } from 'react'
import { useNotebook } from './NotebookContext'
import NoteMenu from './Menu/NoteMenu'
import NoteArea from './NoteArea/NoteArea'

const NotebookApp = () => {
  const {setCreatingNote, setActiveNoteId, handleDraft} = useNotebook();

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if (e.altKey && e.key.toLocaleLowerCase() === 'x') {
        e.preventDefault();
        setCreatingNote(true);
        setActiveNoteId(null);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown)

  }, [setCreatingNote])

  return (
    <div className = "flex flex-row h-full">
        <NoteMenu/>
        <NoteArea/>
      </div>
  )
}

export default NotebookApp