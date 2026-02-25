import React from 'react'

const NoteAreaIdle = () => {
  return (
    <div className = "h-full w-full flex flex-col justify-center items-center gap-2">
        <div className = "relative flex justify-center items-center px-12 py-10 bg-gray-50 rounded-full">
            <div className = "w-12 h-16 bg-gray-200 rounded-md shadow-md absolute bottom-10 rotate-12 left-14"></div>
            <div className = "w-12 h-16 bg-gray-300/60 rounded-md shadow-md"></div>
        </div>
        <p className = "text-black/40">Create a note using Alt + X or select a note.</p>
      </div>
  )
}

export default NoteAreaIdle