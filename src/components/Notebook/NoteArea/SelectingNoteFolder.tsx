import { Folder } from "feather-icons-react"
import { useState, useRef, useCallback } from "react"
import { useNotebook } from "../NotebookContext";
import { type Folders } from "../types";

const SelectingNoteFolder = () => {

  const {folders, handleFolders, handleNoteUpdates, draft} = useNotebook()

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const filtered = folders.filter(f => f.title.toLowerCase().includes(query.toLowerCase()));
  const folderLabel = draft?.folder ? draft.folder : "Select a Folder";
  const showCreateOption = query.trim().length > 0 && !folders.some(f => f.title.toLowerCase() === query.toLowerCase());
  const totalOptions = showCreateOption ? [...filtered, "Create New"] : filtered;
  const selectedOption = totalOptions[focusedIndex];

console.log(focusedIndex)

   const handleSelectClick = () => {
    setIsSearching(true)
  }

  const handleSelectIndex = (option: string | Folders) => {
      if(typeof option === "string") {
        handleFolders(query);
        handleNoteUpdates('folder', query);
      }

      else {
        handleNoteUpdates('folder', option.title);
      }
       setIsSearching(false);
       setQuery("");
       setFocusedIndex(0);
  }

  const handleKeyDown = useCallback((e:React.KeyboardEvent) => {
    if (e.key === "ArrowUp"){
       e.preventDefault();
       setFocusedIndex((prev) => (prev - 1 + totalOptions.length) % totalOptions.length)
    }

    if (e.key === "ArrowDown") {
       e.preventDefault();
       setFocusedIndex((prev) => (prev + 1 + totalOptions.length) % totalOptions.length)
    }

    if (e.key === "Enter") {
      handleSelectIndex(selectedOption)
    }

    if (e.key === "Escape") {
      setIsSearching(false)
      setQuery("")
    }
  },[totalOptions, focusedIndex, handleSelectIndex]);

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
         onChange = {(e) => {
          setQuery(e.target.value)
          setFocusedIndex(0)
         }}
         onKeyDown={handleKeyDown}
         className = "rounded-md border border-gray-300 px-2"
         />
         {totalOptions.length > 0 && (
          <div className = "absolute top-full left-0 min-w-75 bg-white shadow-lg h-auto p-1 rounded-md">
            {totalOptions.map((option, index) =>{
             if( typeof option === "string") {
              return(
                <div 
                key = "Create New"
                className={`cursor-pointer w-full py-1 px-2 rounded-md ${
                index === focusedIndex ? "bg-gray-200 ring-2 ring-blue-500/50" : "hover:bg-gray-100"
                }`}
                onClick={() => {
                 handleSelectIndex(option)
                }}
                onMouseEnter={() => setFocusedIndex(index)}
                >
                  <p>Create {query} folder</p>
                </div>
              )
             }
             return(
            <div
            key = {option.id}
            onClick = {() => {
              handleSelectIndex(option)
            }}
            onMouseEnter={() => setFocusedIndex(index)}
            className={`cursor-pointer w-full py-1 px-2 rounded-md ${
                      index === focusedIndex ? "bg-gray-200 ring-2 ring-blue-500/50" : "hover:bg-gray-100"
                      }`}
            >
                {option.title}
            </div> 
             )
            }
            )}
         </div>
         )}
      </div>
    )
  )
}

export default SelectingNoteFolder