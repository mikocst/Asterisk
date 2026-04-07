import { Folder } from "feather-icons-react"
import { useState, useRef } from "react"
import { useNotebook } from "../NotebookContext";

const SelectingNoteFolder = () => {

  const {folders, handleFolders, handleNoteUpdates} = useNotebook()

  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  return (
    <div className = "flex flex-row justify-between">
            <div className = "flex flex-row gap-2 items-center">
                <Folder size={"20px"} className = "text-black/50"/>
                <p className = "text-black/50">Select a Folder</p>
            </div>
    </div>
  )
}

export default SelectingNoteFolder