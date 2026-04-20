import { useState } from 'react';
import NoteMenuHeader from './NoteMenuHeader';
import NoteInput from './NoteInput';
import FavoriteNotes from './FavoriteNotes';
import RecentNotes from './RecentNotes';
import Folders from './Folders';

const NoteMenu = () => {

  const [searchQuery, setSearchQuery] = useState<string>("");
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className = "flex flex-col h-full w-xs bg-gray-100/50 p-4 border-r border-gray-200 gap-4">
        <NoteMenuHeader/>
        <NoteInput
        value = {searchQuery}
        onChange = {(e) => setSearchQuery(e.target.value)}
        />
        {isSearching === false ? (
          <div className = "flex flex-col gap-4">
             <FavoriteNotes/>
             <RecentNotes/>
             <Folders/>
          </div>
        ) : (
          <div>

          </div>
        )}
    </div>
  )
}

export default NoteMenu