import { Folder } from "feather-icons-react"
import { useState, useRef } from "react"
import { useNotebook } from "../NotebookContext";

const SelectingNoteFolder = () => {

  const {folders, handleFolders, handleNoteUpdates, draft} = useNotebook()

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  const handleSelectClick = () => {
    setIsSearching(true)
  }

  const filtered = folders.filter(f => f.title.toLowerCase().includes(query.toLowerCase()));
  const folderLabel = draft?.folder ? draft.folder : "Select a Folder";
  

  return (
    !isSearching ? (
      <div 
      onClick={handleSelectClick}
      className = "flex flex-row justify-between"
      >
            <div className = "flex flex-row gap-2 items-center">
                <Folder size={"20px"} className = "text-black/50"/>
                <p className = "text-black/50">{folderLabel}</p>
            </div>
    </div>
    ) : (
      <div className = "relative flex flex-row gap-2">
        <Folder size={"20px"} className = "text-black/50"/>
        <input
         value = {query}
         autoFocus
         onChange = {(e) => setQuery(e.target.value)}
         className = "rounded-md border border-gray-300 px-2"
         />
         <div className = "absolute top-full left-0 w-[27%] bg-white/95 shadow-lg h-auto p-2 rounded-md">
            {filtered.map((folder, index) =>
            <div
            key = {folder.id}
            onClick = {() => {
              handleNoteUpdates('folder', folder.title)
              setIsSearching(false)
              setQuery("")
            }}
            onMouseEnter={() => setFocusedIndex(index)}
            className = "cursor-pointer"
            >
              <button>
                {folder.title}
              </button>
            </div>
            )}
         </div>
      </div>
    )
  )
}

export default SelectingNoteFolder