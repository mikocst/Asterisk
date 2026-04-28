import React, {useRef, useEffect} from 'react'
import {type Block} from '../types'

interface TextBlockProps {
    index: number
    focusedIndex: {index: number; position: number} | null
    block: Block
    onUpdate: (index: number, content: string) => void
    onKeyDown:(e:React.KeyboardEvent<HTMLTextAreaElement>, index: number) => void
    onTriggerMenu: (coords: {top: number, left:number}) => void
    onCloseMenu: () => void
}

const TextBlock = ({index, focusedIndex, block, onUpdate, onKeyDown, onTriggerMenu, onCloseMenu}: TextBlockProps) => {
  const textBlockRef = useRef<HTMLTextAreaElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  const handleTextChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const selectionIndex = e.target.selectionStart;
    const lastChar = value[selectionIndex - 1];

    onUpdate(index, value);

    if(lastChar === '/') {
      setTimeout(() => {
        if(textBlockRef.current) {
          const {offsetTop, offsetLeft} = textBlockRef.current;

          onTriggerMenu({
            top: offsetTop + 24,
            left: offsetLeft + 10
          })
        }
      }, 0)
    }
    else {
      onCloseMenu()
    }
  }

  useEffect(() => {
    const textBlock = textBlockRef.current;

    if(textBlock) {
        textBlock.style.height = "0px";
        textBlock.style.height = `${textBlock.scrollHeight}px`
    }
  },[block.content]);

  useEffect(() => {
    if(focusedIndex?.index === index && textBlockRef.current){
      textBlockRef.current.focus();
      const pos = focusedIndex.position ?? 0
      textBlockRef.current.setSelectionRange(pos, pos)
    }
  },[focusedIndex, index])

  return (
    <div className = "group relative w-full mb-1">
        <textarea
        ref = {textBlockRef}
        value = {block.content}
        onChange = {handleTextChange}
        onKeyDown = {(e) => onKeyDown(e, index)}
        rows = {1}
        placeholder = {index === 0 ? "Type '/' for commands..." : ""}
        className={`w-full p-1 resize-none bg-transparent outline-none overflow-hidden transition-all duration-75 ${
                    block.type === 'h1' ? 'text-4xl font-bold' : 
                    block.type === 'h2' ? 'text-3xl font-semibold' : 
                    block.type === 'h3' ? 'text-2xl font-semibold' : 
                    'text-sm'
                }`}
        />
    </div>
  )
}

export default TextBlock