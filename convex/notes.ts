import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
    blocks: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        content: v.string(),
      })
    ),
    folder: v.string(),
    folderId: v.union(v.string(), v.null()),
    isFavorited: v.boolean()
  },
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert("notes", {
      ...args,
      userId: "user_placeholder", 
      lastModified: Date.now(),
    });
    
    return noteId;
  },
});

export const updateNoteBlock = mutation({
  args: {
    noteId: v.id("notes"),
    blocks: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.noteId, {
      blocks: args.blocks,
      lastModified: Date.now(),
    });
  },
});