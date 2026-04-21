import { useEffect } from 'react'
import { useNotebook } from './NotebookContext'
import NoteMenu from './Menu/NoteMenu'
import NoteArea from './NoteArea/NoteArea'

const NotebookApp = () => {
  const {setCreatingNote, setActiveNoteId, setIsMakingFolder, activeNoteId, creatingNote, handleNoteFavorite, handleDeleteNote, setDraft,isSearching, setIsSearching} = useNotebook();

  useEffect(() => {
    const handleKeyDown = (e:KeyboardEvent) => {
      if(!e.altKey) {
        return
      }

      const key = e.key.toLowerCase();

      if (e.key.toLocaleLowerCase() === 'c') {
        e.preventDefault();
        setCreatingNote(true);
        setActiveNoteId(null);
      }

      else if (e.key.toLocaleLowerCase() === 'l') {
        e.preventDefault();
        setIsMakingFolder(true)
      }

      if (activeNoteId || creatingNote) {
        switch (key) {
          case 'f':
            e.preventDefault();
            if(activeNoteId) {
              handleNoteFavorite(activeNoteId);
            }
            break;
          
          case 'd':
            e.preventDefault();
            if(activeNoteId) {
              handleDeleteNote(activeNoteId)
            }
            else {
              setCreatingNote(false);
              setDraft(null)
            }
            break;

            case 'w':
              e.preventDefault();
              document.getElementById('note-body-area')?.focus();
              break;

            case 's':
              e.preventDefault();
              if(isSearching) {
                document.getElementById('folder-select')?.focus()
              }
              else {setIsSearching(true)}
              break;
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown)

  }, [activeNoteId, creatingNote, setCreatingNote, setActiveNoteId, setIsMakingFolder, handleNoteFavorite, handleDeleteNote, setDraft, isSearching, setIsSearching])

  return (
    <div className = "flex flex-row h-full">
        <NoteMenu/>
        <NoteArea/>
      </div>
  )
}

export default NotebookApp