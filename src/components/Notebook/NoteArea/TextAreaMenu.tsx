import React from 'react'
import type { SlashMenuItem } from '../types'
import { options } from '../Plugins/constants';

interface textAreMenuProps {
    positionTop: number
    positionLeft: number
    onSelect: (type: SlashMenuItem) => void
    query: string
    selectedIndex: number
    filteredOptions: typeof options
}

const TextAreaMenu = ({positionTop, positionLeft, onSelect, query, selectedIndex, filteredOptions}: textAreMenuProps) => {

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
    {filteredOptions.length === 0 ? (
      <div className="p-2 text-gray-400 text-sm italic">No results found</div>
    ) : (
      filteredOptions.map((o, index) => {
      const isSelected = index === selectedIndex

      return(
        <div className={`p-2 cursor-pointer rounded-md ${
        isSelected ? 'bg-gray-100' : 'hover:bg-gray-100'
        }`}
        key = {o.value}
        onMouseDown = {(e) => {
          e.preventDefault();
          onSelect(o.value)
        }}
        >
          <p className = "pointer-events-none">{o.label}</p>
        </div>
      )
    })
  )}
  </div>
)}
  

export default TextAreaMenu