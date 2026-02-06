import React from 'react'
import NoteMenuHeader from './NoteMenuHeader';
import NoteInput from './NoteInput';
import FavoriteNotes from './FavoriteNotes';
import RecentNotes from './RecentNotes';
import Folders from './Folders';

const NoteMenu = () => {
  return (
    <div className = "flex flex-col h-full w-xs bg-gray-100/50 p-4 border-r border-gray-200 gap-4">
        <NoteMenuHeader/>
        <NoteInput/>
        <FavoriteNotes/>
        <RecentNotes/>
        <Folders/>
    </div>
  )
}

export default NoteMenu