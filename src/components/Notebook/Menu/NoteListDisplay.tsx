import React from 'react'
import { type Note } from '../types'

interface NoteListDisplayProps {
    noteList: Note[]
    handleNoteClick: (id:string) => void
}

const NoteListDisplay = ({noteList, handleNoteClick}: NoteListDisplayProps) => {
  return (
        <div className = "flex flex-col gap-2">
                                {noteList.map((singleNote) => 
                                <div
                                onClick={() => handleNoteClick(singleNote.id)} 
                                key = {singleNote.id}
                                className = "flex flex-col border-b border-gray-300/70 w-full justify-center p-1 cursor-pointer hover:bg-gray-200 hover:rounded-md"
                                >
                                    <h3 className = "text-black/50">{singleNote.title}</h3>
                                    <div className = "flex flex-row gap-1 text-sm text-black/30">
                                        <p>{singleNote.createdAt}:</p>
                                        <p className = "truncate max-w-[17ch]">{singleNote.content}</p>
                                    </div>
                                </div>
                                )}
        </div>

  )
}

export default NoteListDisplay