import React, {useRef, useEffect} from 'react'
import {type Block} from '../types'

interface TextBlockProps {
    index: number
    focusedIndex: {index: number; position: number} | null
    block: Block
    isSelected: boolean
    onUpdate: (index: number, content: string) => void
    onKeyDown:(e:React.KeyboardEvent<HTMLTextAreaElement>, index: number) => void
    onTriggerMenu: (coords: {top: number, left:number}) => void
    onCloseMenu: () => void
    onMouseDown: (e:React.MouseEvent, index: number) => void
    onMouseEnter: () => void
    isDragging: boolean
}

const TextBlock = ({index, focusedIndex, block, onUpdate, onKeyDown, onTriggerMenu, onCloseMenu, isSelected, onMouseDown, onMouseEnter, isDragging}: TextBlockProps) => {
  const textBlockRef = useRef<HTMLTextAreaElement>(null);
  const ghostRef = useRef<HTMLSpanElement>(null);

  const [localContent, setLocalContent] = React.useState(block.content)

  const handleTextChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const selectionIndex = e.target.selectionStart;
    const lastChar = value[selectionIndex - 1];

    setLocalContent(value);
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
  },[focusedIndex, index]);

  useEffect(() => {
    setLocalContent(block.content);
  }, [block.content]);

  return (
    <div className={`group relative w-full pb-1 transition-colors duration-150 ${
            isSelected ? "bg-blue-500/20" : "bg-transparent"
        }`}
        data-block-id = {block.id}
        onMouseDown={(e) => {
          if (e.shiftKey || e.target === e.currentTarget) {
                onMouseDown(e, index);
          }
        }}
        onMouseEnter = {() => {
          if(isDragging) onMouseEnter();
        }}
        >
        <textarea
        ref = {textBlockRef}
        value = {localContent}
        onChange = {handleTextChange}
        onKeyDown = {(e) => onKeyDown(e, index)}
        rows = {1}
        placeholder = {index === 0 ? "Type '/' for commands..." : ""}
        className={`w-full p-1 resize-none bg-transparent outline-none overflow-hidden transition-all duration-75 
          ${isDragging ? 'pointer-events-none' : ''} 
          ${
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