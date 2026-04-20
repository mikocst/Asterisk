import React from 'react'

interface NoteInputProps {
  value: string
  onChange: (e:React.ChangeEvent<HTMLInputElement>) => void

}

const NoteInput = ({value, onChange}:NoteInputProps) => {
  return (
    <input 
    type = "search"
    value = {value}
    onChange = {onChange}
    className = "border border-gray-200 bg-white rounded-sm px-2 py-1"
    placeholder='Search Notebook...'>
    </input>
  )
}

export default NoteInput