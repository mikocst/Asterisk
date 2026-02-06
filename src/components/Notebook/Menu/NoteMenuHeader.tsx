import React from 'react'
import { Edit } from 'feather-icons-react'

const NoteMenuHeader = () => {
  return (
    <div className = "flex flex-row justify-between items-center">
        <h1>Notes</h1>
        <button className = "p-1 rounded-sm border border-gray-400">
            <Edit size={'16px'} className = "text-gray-400"/>
        </button>
    </div>
  )
}

export default NoteMenuHeader