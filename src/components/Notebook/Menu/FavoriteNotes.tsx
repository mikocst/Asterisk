import { useNotebook } from "../NotebookContext"

const FavoriteNotes = () => {
  const {notes, handleNoteClick} = useNotebook();

  const favoriteNotes = notes.filter((note) => note.isFavorited);

  return (
    <div className = "flex flex-col gap-2">
        <h2 className = "text-lg font-medium text-gray-500">FAVORITES</h2>
        <div className = "w-full flex flex-col justify-center">
            {favoriteNotes.length > 0 ? (
              favoriteNotes.map((favNote) =>
              <div
              key = {favNote.id}
              onClick={() => handleNoteClick(favNote.id)}
              className = "flex flex-col border-b border-gray-300/70 w-full justify-center pb-1 cursor-pointer"
              >
                <h3 className = "text-black/50">{favNote.title}</h3>
                <div className = "flex flex-row gap-1 text-sm text-black/30">
                    <p>{favNote.createdAt}:</p>
                    <p className = "truncate max-w-[17ch]">{favNote.content}</p>
                </div>
              </div>
              )
            ):
            <p className = "text-sm text-gray-400 w-full text-center">No Notes Favorited</p>
            }
        </div>
    </div>
  )
}

export default FavoriteNotes