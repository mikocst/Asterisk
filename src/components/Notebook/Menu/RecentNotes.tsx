import React from 'react'
import { useNotebook } from '../NotebookContext'
import NoteListDisplay from './NoteListDisplay';

const RecentNotes = () => {

  const {notes, handleNoteClick} = useNotebook();

  return (
    <div className = "flex flex-col gap-1">
        <h2 className = "text-lg font-medium text-gray-500">RECENT NOTES</h2>
            {notes.length > 0 ? (
              <NoteListDisplay
              noteList={notes}
              handleNoteClick={handleNoteClick}
              />
            ) : (
              <div className='w-full flex justify-center'>
                <p className = "text-sm text-gray-400">No Recent Notes Available</p>
              </div>
            )}
    </div>
  )
}

export default RecentNotes