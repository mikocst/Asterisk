import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getNotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("notes").collect();
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