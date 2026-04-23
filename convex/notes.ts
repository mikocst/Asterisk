import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNotes = query({
  args: {},
  handler: async (ctx) => {
    // We sort by creation time so the newest notes are usually at the top
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
    folder: v.optional(v.string()),
    folderId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const noteId = await ctx.db.insert("notes", {
      title: args.title,
      blocks: args.blocks,
      userId: "user_placeholder", 
      isFavorited: false, 
      folder: args.folder ?? "General",
      folderId: args.folderId ?? "1",
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