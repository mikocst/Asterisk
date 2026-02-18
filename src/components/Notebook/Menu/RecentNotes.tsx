import React from 'react'
import { useNotebook } from '../NotebookContext'

const RecentNotes = () => {

  const {notes} = useNotebook()

  return (
    <div className = "flex flex-col gap-2">
        <h2 className = "text-lg font-medium text-gray-500">RECENT NOTES</h2>
            {notes.length > 0 ? (
              <div className = "bg-gray-200/50 p-2 rounded-sm">
                {notes.map((note) => {
                  return (
                    <div 
                    key = {note.id}
                    className = "flex flex-col border-b border-gray-300/70 w-full justify-center pb-1">
                       <h3 className = "text-black/50">{note.title}</h3>
                       <div className = "flex flex-row gap-1 text-sm text-black/30">
                        <p>{note.createdAt}</p>
                        <p>{note.content}</p>
                       </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className='w-full flex justify-center'>
                <p className = "text-sm text-gray-400">No Recent Notes Available</p>
              </div>
            )}
    </div>
  )
}

export default RecentNotes