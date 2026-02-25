import React from 'react'
import { Clock } from 'feather-icons-react'
import { useNotebook } from '../NotebookContext'

//need to link this to an id

const CreatedNoteDate = () => {

  const {notes, activeNoteId, creatingNote} = useNotebook();
  if (!activeNoteId && !creatingNote) return null

  const currentNote = notes.find((note) => note.id === activeNoteId);
  const currentDate = new Date();
  const rawDate = currentNote ? currentNote.createdAt : new Date();

  const displayDate = new Date(rawDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});

  return (
    <div className = "flex flex-row justify-between">
            <div className = "flex flex-row gap-2 items-center">
                <Clock size={"20px"} className = "text-black/50"/>
                <p className = "text-black/50">Created at {displayDate}</p>
            </div>
    </div>
  )
}

export default CreatedNoteDate