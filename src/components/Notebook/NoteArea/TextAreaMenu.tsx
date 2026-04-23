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
    className="bg-white shadow-md border rounded-md"
  >
    <p className="p-2">H1 - Heading</p>
  </div>
)}
  

export default TextAreaMenu