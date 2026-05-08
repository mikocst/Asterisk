import React from 'react'
import { type Note } from '../types'
import type { Id } from '@convex/_generated/dataModel'
import { type LexicalTextNode, type LexicalElementNode, type LexicalEditorState } from '../types'

interface NoteListDisplayProps {
    noteList: Note[]
    handleNoteClick: (id:Id<"notes">) => void
}

const NoteListDisplay = ({noteList, handleNoteClick}: NoteListDisplayProps) => {

  const getLexicalPreview = (lexicalString: string) => {
    if(!lexicalString) return;

    try {
    const state: LexicalEditorState = JSON.parse(lexicalString);

    const extractText = (nodes: (LexicalTextNode | LexicalElementNode)[]): string => {
      return nodes
        .map((node) => {
          if (node.type === 'text') {
            return (node as LexicalTextNode).text;
          } else if ('children' in node) {
            return extractText(node.children);
          }
          return "";
        })
        .join("");
    };

    const fullText = extractText(state.root.children);
    return fullText.trim() || "Empty note";
    
  } catch (e) {
        console.error("Error parsing Lexical JSON", e);
        return "Preview unavailable";
    }
  }

  return (
        <div className = "flex flex-col gap-2">
                                {noteList.map((singleNote) => 
                                <div
                                onClick={() => handleNoteClick(singleNote._id)} 
                                key = {singleNote._id}
                                className = "flex flex-col border-b border-gray-300/70 w-full justify-center p-1 cursor-pointer hover:bg-gray-200 hover:rounded-md"
                                >
                                    <h3 className = "text-black/50">{singleNote.title}</h3>
                                    <div className = "flex flex-row gap-1 text-sm text-black/30">
                                        <p>{ singleNote._creationTime ? new Date(singleNote._creationTime).toLocaleDateString(undefined, {
                                            month: "short",
                                            day: "numeric"
                                        }) : "Just now"}:
                                        </p>
                                        <p className = "truncate max-w-[17ch]">
                                            {singleNote.lexicalData ? getLexicalPreview(singleNote.lexicalData) : "No Content"}</p>
                                    </div>
                                </div>
                                )}
        </div>

  )
}

export default NoteListDisplay