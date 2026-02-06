import React from 'react'

const RecentNotes = () => {
  return (
    <div className = "flex flex-col gap-2">
        <h2 className = "text-lg font-medium text-gray-500">RECENT NOTES</h2>
        <div className = "w-full flex justify-center">
            <p className = "text-sm text-gray-400">No Recent Notes Available</p>
        </div>
    </div>
  )
}

export default RecentNotes