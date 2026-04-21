import { useState } from 'react';
import NoteMenuHeader from './NoteMenuHeader';
import NoteInput from './NoteInput';
import FavoriteNotes from './FavoriteNotes';
import RecentNotes from './RecentNotes';
import Folders from './Folders';
import SearchDisplay from './SearchDisplay';
import { useNotebook } from '../NotebookContext';

const NoteMenu = () => {

  const {notes} = useNotebook();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const isSearching = searchQuery.trim().length > 0;
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
          <SearchDisplay
          searchedNotes={filteredNotes}
          searchQuery={searchQuery}
          />
        )}
    </div>
  )
}

export default NoteMenu