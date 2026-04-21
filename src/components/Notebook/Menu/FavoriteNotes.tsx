import { useNotebook } from "../NotebookContext"
import NoteListDisplay from "./NoteListDisplay";

const FavoriteNotes = () => {
  const {notes, handleNoteClick} = useNotebook();

  const favoriteNotes = notes.filter((note) => note.isFavorited);

  return (
    <div className = "flex flex-col gap-2">
        <h2 className = "text-lg font-medium text-gray-500">FAVORITES</h2>
        <div className = "w-full flex flex-col justify-center">
            {favoriteNotes.length > 0 ? (
              <NoteListDisplay
              noteList={favoriteNotes}
              handleNoteClick={handleNoteClick}
              />
            ):
            <p className = "text-sm text-gray-400 w-full text-center">No Notes Favorited</p>
            }
        </div>
    </div>
  )
}

export default FavoriteNotes