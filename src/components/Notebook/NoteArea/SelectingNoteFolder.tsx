import { Folder } from "feather-icons-react"

const SelectingNoteFolder = () => {
  return (
    <div className = "flex flex-row justify-between">
            <div className = "flex flex-row gap-2">
                <Folder size={"20px"} className = "text-black/50"/>
                <p className = "text-black/50">Select a Folder</p>
            </div>
    </div>
  )
}

export default SelectingNoteFolder