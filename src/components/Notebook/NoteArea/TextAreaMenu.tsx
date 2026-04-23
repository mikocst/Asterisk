import React from 'react'

interface textAreMenuProps {
    positionTop: number
    positionLeft: number
}

const TextAreaMenu = ({positionTop, positionLeft}: textAreMenuProps) => {
  return (
  <div 
    style={{ 
      position: 'absolute', 
      top: positionTop,
      left: positionLeft,
      zIndex: 50 
    }}
    className="bg-white shadow-md border border-gray-200 rounded-md"
  >
    <div className="p-2 hover:bg-gray-100 cursor-pointer">
        <p>H1 - Heading</p>
    </div>
  </div>
)}
  

export default TextAreaMenu