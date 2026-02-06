import React from 'react'

const FavoriteNotes = () => {
  return (
    <div className = "flex flex-col gap-2">
        <h2 className = "text-lg font-medium text-gray-500">FAVORITES</h2>
        <div className = "w-full flex justify-center">
            <p className = "text-sm text-gray-400">No Notes Favorited</p>
        </div>
    </div>
  )
}

export default FavoriteNotes