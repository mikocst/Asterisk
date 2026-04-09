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
  const showCreateOption = query.trim().length > 0 && !folders.some(f => f.title.toLowerCase() === query.toLowerCase());
  const totalOptions = showCreateOption ? [...filtered, ""] : filtered;

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
         <div className = "absolute top-full left-0 w-[20%] bg-white shadow-lg h-auto p-1 rounded-md">
            {totalOptions.map((option, index) =>{
             if( typeof option === "string") {
              return(
                <div 
                className = "cursor-pointer hover:bg-gray-200/50 rounded-md w-full py-1 px-2 flex items-start"
                onClick={() => handleFolders(query)}
                >
                  <p>Create {query}</p>
                </div>
              )
             }
             return(
            <div
            key = {option.id}
            onClick = {() => {
              handleNoteUpdates('folder', option.title)
              setIsSearching(false)
              setQuery("")
            }}
            onMouseEnter={() => setFocusedIndex(index)}
            className = "cursor-pointer"
            >
              <button className = "hover:bg-gray-200/50 rounded-md w-full py-1 px-2 flex items-start">
                {option.title}
              </button>
            </div> 
             )
            }
            )}
         </div>
      </div>
    )
  )
}

export default SelectingNoteFolder