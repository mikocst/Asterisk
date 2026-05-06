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