import React from 'react'
import { type Note } from '../types'
import NoteListDisplay from './NoteListDisplay'
import { useNotebook } from '../NotebookContext'

interface SearchDisplayProps {
    searchedNotes: Note[]
    searchQuery: string
}

const SearchDisplay = ({searchedNotes, searchQuery}:SearchDisplayProps) => {

    const {handleNoteClick} = useNotebook()

  return (
    <div className = "flex flex-col gap-2">
        <p className = "text-gray-500">Search results for "{searchQuery}"</p>
        {searchedNotes.length > 0 ? (
            <NoteListDisplay
            noteList = {searchedNotes}
            handleNoteClick={handleNoteClick}
        />
        ) : (
            <p className = "w-full text-center text-md text-gray-400">No notes found.</p>
        )}
    </div>
  )
}

export default SearchDisplay