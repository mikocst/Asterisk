import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getFoldersWithNotes = query({
    handler: async (ctx) => {
        const userId = "user_123"
        const folders = await ctx.db
            .query("folders")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const foldersWithDetails = await Promise.all(
            folders.map(async (folder) => {
                const notes = await ctx.db
                .query("notes")
                .withIndex("by_folderId", (q) => q.eq("folderId", folder._id))
                .collect()

                return {
                    ...folder,
                    count: notes.length,
                    notes: notes
                }
            })
        )
        return foldersWithDetails
    }
})

export const createFolder = mutation({
    args: {title:v.string()},
    handler: async (ctx, args) => {
        const userId = "user_123";
        return await ctx.db.insert("folders", {
            title: args.title,
            userId: userId
        })
    }
})

export const removeFolder = mutation({
    args: {id: v.id("folders")},
    handler: async(ctx, args) => {
        await ctx.db.delete(args.id);

        const notes = await ctx.db
            .query("notes")
            .withIndex("by_folderId", (q) => q.eq("folderId", args.id))
            .collect()
        
        for (const note of notes) {
            await ctx.db.delete(note._id)
        }
    }
})