import React from 'react'
import { Plus } from 'feather-icons-react'

const Folders = () => {
  return (
    <div className = "flex flex-col gap-2">
        <div className = "flex flex-row items-center justify-between text-gray-500">
            <h2 className = "text-lg font-medium text-gray-500">FOLDERS</h2>
            <button className = "cursor-pointer">
                <Plus size={'20px'}/>
            </button>
        </div>
        <div className = "w-full flex justify-center">
            <p className = "text-sm text-gray-400">No Notes Favorited</p>
        </div>
    </div>
  )
}

export default Folders