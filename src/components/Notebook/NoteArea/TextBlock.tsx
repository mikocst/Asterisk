import React, {useRef, useEffect} from 'react'
import {type Block} from '../types'

interface TextBlockProps {
    index: number
    block: Block
    onUpdate: (index: number, content:string) => void
    onKeyDown:(e:React.KeyboardEvent, index: number) => void
}

const TextBlock = ({index, block, onUpdate, onKeyDown}: TextBlockProps) => {
  const textBlockRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textBlock = textBlockRef.current;

    if(textBlock) {
        textBlock.style.height = "0px";
        textBlock.style.height = `${textBlock.scrollHeight}px`
    }
  },[block.content])

  return (
    <div className = "group relative w-full mb-1">
        <textarea
        ref = {textBlockRef}
        value = {block.content}
        onChange = {(e) => onUpdate(index, e.target.value)}
        onKeyDown = {(e) => onKeyDown(e, index)}
        rows = {1}
        placeholder = {index === 0 ? "Type '/' for commands..." : ""}
        className={`w-full p-1 resize-none bg-transparent outline-none overflow-hidden transition-all duration-75 ${
                    block.type === 'h1' ? 'text-4xl font-bold' : 
                    block.type === 'h2' ? 'text-3xl font-semibold' : 
                    block.type === 'h3' ? 'text-2xl font-semibold' : 
                    'text-base'
                }`}
        />
    </div>
  )
}

export default TextBlock