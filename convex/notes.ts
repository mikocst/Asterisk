import { v } from "convex/values";
import type {LexicalTextNode , LexicalEditorState, LexicalElementNode} from "../src/components/Notebook/types"
import { mutation, query } from "./_generated/server";

type LexicalNode = LexicalTextNode | LexicalElementNode;

function isTextNode(node: LexicalNode): node is LexicalTextNode {
  return node.type === 'text';
}

export const getNotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notes")
      .order("desc")
      .collect();
  },
});

export const createNote = mutation({
  args: {
    title: v.string(),
    lexicalData: v.optional(v.string()),
    blocks: v.optional(v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        content: v.string(),
      })
    )),
    folder: v.string(),
    folderId: v.union(v.id("folders"), v.null()),
    isFavorited: v.boolean()
  },
  handler: async (ctx, args) => {
    const preview = args.lexicalData ? getPlainTextFromLexical(args.lexicalData) : "";

    const noteId = await ctx.db.insert("notes", {
      ...args,
      preview,
      userId: "user_placeholder", 
      lastModified: Date.now(),
    });
    
    return noteId;
  },
});

export const updateNoteBlock = mutation({
  args: {
    noteId: v.id("notes"),
    title: v.optional(v.string()),
    lexicalData: v.optional(v.string()),
    isFavorited: v.optional(v.boolean()),
    folder: v.optional(v.string()),
    folderId: v.optional(v.id("folders")),
    blocks: v.optional(v.array( 
      v.object({
        id: v.string(),
        type: v.string(),
        content: v.string(),
      })
    )),
  },
  handler: async (ctx, args) => {
    const {noteId, ...updates} = args;

    let preview;
    if(args.lexicalData !== undefined){
      preview = getPlainTextFromLexical(args.lexicalData);
    }

    await ctx.db.patch(args.noteId, {
      ...updates,
      ...(preview !== undefined && {preview}),
      lastModified: Date.now(),
    });
  },
});

export const deleteNoteBlock = mutation({
  args: {
    noteId: v.id("notes"),
  },
  handler: async(ctx, args) => {
    await ctx.db.delete(args.noteId)
  }
})

export const getPlainTextFromLexical = (lexicalJSON: string): string => {
  try {
    const state: LexicalEditorState = JSON.parse(lexicalJSON);
    
    const extract = (nodes: LexicalNode[]): string => {
      return nodes.map((node) => {
     
        if (isTextNode(node)) {
          return node.text;
        } 
      
        if ('children' in node) {
          return extract(node.children);
        }
        
        return '';
      }).join('');
    };

    const text = extract(state.root.children);
    
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  } catch (e) {
    console.error("Failed to parse Lexical state:", e);
    return "";
  }
};