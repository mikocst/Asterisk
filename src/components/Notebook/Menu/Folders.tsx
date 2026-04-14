import { useState } from 'react';
import { Plus, Folder } from 'feather-icons-react'
import { useNotebook } from '../NotebookContext'

const Folders = () => {

  const {folders, handleFolders, isMakingFolder, setIsMakingFolder, notes, handleNoteClick} = useNotebook();

  const [folderName, setFolderName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [openFolderIds, setOpenFolderIds] = useState<string[]>([]);

  const isDuplicate = folders.some((folder) => 
    folder.title.toLowerCase() === folderName.trim().toLowerCase()
);

  const errorMessage = "A folder with this name already exists!"

  const handleIsMakingFolder = () => {
    setIsMakingFolder(true)
  }

  const handleFolderName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setFolderName(e.target.value)
  }

  const handleUpdatingFolderName = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && folderName.trim().length > 0) {
            if(!isDuplicate) {
            handleFolders(folderName);
            setFolderName("");
            setIsMakingFolder(false)
            }

            else if(isDuplicate) {
                setError(errorMessage)
            }
        }

        else if (e.key === "Escape") {
            setFolderName("")
            setIsMakingFolder(false)
        }
  }

  const handleBlur = () => {
        if(folderName.trim().length > 0 && !isDuplicate){
            handleFolders(folderName)
            setFolderName("")
            setIsMakingFolder(false)
        }

        else if(folderName.trim().length === 0) {
            setIsMakingFolder(false)
            setError(null)
        }

        else {
            setError(errorMessage)
        }
  }

  const toggleFolder = (id:string) => {
       setOpenFolderIds((prev) => {
            if(prev.includes(id)){
                return prev.filter(item => item !== id)
            }

            else {
                return [...prev, id]
            }
       })
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
                const isOpen = openFolderIds.includes(folder.id);
                const folderNotes = notes.filter((note) => 
                    note.folderId === folder.id
                )

                console.log(`Folder: ${folder.title}, ID: ${folder.id}, Open: ${isOpen}, Notes Found: ${folderNotes.length}`);

                return (
                        <div className = "flex flex-col gap-2">
                            <div 
                            key={folder.id}
                            onClick = {() => toggleFolder(folder.id)}
                            className = "flex flex-row gap-2 p-1 items-center text-gray-500 cursor-pointer"
                            >
                                <Folder size = {'16px'}/>
                                <h3>{folder.title}</h3>
                            </div>
                            {isOpen && (
                            <div className = "flex flex-col gap-2 ml-4">
                                {folderNotes.map((folderNote) => 
                                <div
                                onClick={() => handleNoteClick(folderNote.id)} 
                                key = {folderNote.id}
                                className = "flex flex-col border-b border-gray-300/70 w-full justify-center p-1 rounded-md cursor-pointer hover:bg-gray-200"
                                >
                                    <h3 className = "text-black/50">{folderNote.title}</h3>
                                    <div className = "flex flex-row gap-1 text-sm text-black/30">
                                        <p>{folderNote.createdAt}:</p>
                                        <p className = "truncate max-w-[17ch]">{folderNote.content}</p>
                                    </div>
                                </div>
                                )
                                }
                            </div>
                            )}
                          </div>
                        )
            })}
            {isMakingFolder &&
            <div className = "flex flex-col gap-1"> 
                <div className = "flex flex-row gap-2 items-center">
                    <Folder size = {'16px'}/>
                    <input
                    onKeyDown={handleUpdatingFolderName}
                    onChange={handleFolderName} 
                    value = {folderName}
                    placeholder='Enter Folder Name'
                    autoFocus = {true}
                    onBlur = {handleBlur}
                    className = {`border px-2 rounded-md text-gray-500 ${error ? 'border-red-500' : 'border-gray-200'}`}
                    />
                </div>
                {error && (
                    <p className = "text-red-500 text-sm">{error}</p>
                )}
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