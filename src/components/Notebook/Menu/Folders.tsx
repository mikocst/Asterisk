import { useState } from 'react';
import { Plus, Folder } from 'feather-icons-react'
import { useNotebook } from '../NotebookContext'

const Folders = () => {

  const {folders, handleFolders} = useNotebook();

  const [isMakingFolder, setIsMakingFolder] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("")

  const handleIsMakingFolder = () => {
    setIsMakingFolder(true)
  }

  const handleFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value)
  }

  const handleUpdatingFolderName = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && folderName.trim().length > 0) {
            handleFolders(folderName);
            setFolderName("");
            setIsMakingFolder(false)
        }

        else if (e.key === "Escape") {
            setFolderName("")
            setIsMakingFolder(false)
        }
  }

  return (
    <div className = "flex flex-col gap-2">
        <div className = "flex flex-row items-center justify-between text-gray-500">
            <h2 className = "text-lg font-medium text-gray-500">FOLDERS</h2>
            <button
            onClick = {() => handleIsMakingFolder()}
            className = "cursor-pointer hover:bg-gray-200/50 p-1 rounded-sm">
                <Plus size={'20px'}/>
            </button>
        </div>
        <div className = "w-full flex flex-col justify-center gap-1">
            {folders.map((folder) => {
                        return (
                            <div className = "flex flex-row gap-2 p-1 items-center text-gray-500">
                                <Folder size = {'16px'}/>
                                <h3>{folder.title}</h3>
                            </div>
                        )
            })}
            {isMakingFolder && 
                <div className = "flex flex-row gap-2 p-1 items-center">
                    <Folder size = {'16px'}/>
                    <input
                    onKeyDown={handleUpdatingFolderName}
                    onChange={handleFolderName} 
                    value = {folderName}
                    placeholder='Enter Folder Name'
                    autoFocus = {true}
                    />
                </div>
            }
            {(folders.length === 0 && !isMakingFolder) && 
            <p className = "text-sm text-gray-400 text-center">No Folders Available</p>
            }
        </div>
    </div>
  )
}

export default Folders