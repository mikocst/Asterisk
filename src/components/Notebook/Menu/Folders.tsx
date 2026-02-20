import { useState } from 'react';
import { Plus, Folder } from 'feather-icons-react'
import { useNotebook } from '../NotebookContext'

const Folders = () => {

  const {folders} = useNotebook();

  const [isMakingFolder, setIsMakingFolder] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>("")

  const handleIsMakingFolder = () => {
    setIsMakingFolder(true)
  }

  const handleFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFolderName(e.target.value)
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
                            <div className = "flex flex-row gap-1 p-1">
                                <Folder size = {'20px'}/>
                                <h3>{folder.title}</h3>
                            </div>
                        )
            })}
            {isMakingFolder && 
                <div className = "flex flex-row gap-1 p-1">
                    <Folder size = {'20px'}/>
                    <input
                    onChange={handleFolderName} 
                    value = {folderName}
                    placeholder='Enter Folder Name'/>
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