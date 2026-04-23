import React from 'react'

interface textAreMenuProps {
    positionTop: number
    positionLeft: number
    onSelect: (symbol: string) => void
}

const TextAreaMenu = ({positionTop, positionLeft, onSelect}: textAreMenuProps) => {
  return (
  <div 
    style={{ 
      position: 'absolute', 
      top: positionTop,
      left: positionLeft,
      zIndex: 50 
    }}
    className="bg-white shadow-md border border-gray-200 rounded-md p-2"
  >
    <p className = "text-xs text-gray-400">Basic Text Blocks</p>
    <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
        <p>Text Block</p>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-md"
    onClick = {() => onSelect("# ")}
    >
        <p>H1 - Heading</p>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
        <p>H2 - Heading</p>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
        <p>H3 - Heading</p>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
        <p>Bulleted List</p>
    </div>
    <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-md">
        <p>Numbered List</p>
    </div>
  </div>
)}
  

export default TextAreaMenu