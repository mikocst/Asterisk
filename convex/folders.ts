import { v } from "convex/values";
import { mutation, query, QueryCtx, MutationCtx } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .unique();
}

export const getFoldersWithNotes = query({
    args: {},
    handler: async (ctx) => {
        const user = await getAuthenticatedUser(ctx);
        if(!user) return [];

        const folders = await ctx.db
            .query("folders")
            .withIndex("by_user", (q) => q.eq("userId", user._id))
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
        const user = await getAuthenticatedUser(ctx);
        if(!user) throw new Error("Unauthorized: You must be logged in to create a folder.");
        
        return await ctx.db.insert("folders", {
            title: args.title,
            userId: user._id
        })
    }
})

export const removeFolder = mutation({
    args: {id: v.id("folders")},
    handler: async(ctx, args) => {
        const user = await getAuthenticatedUser(ctx);
        if(!user) throw new Error("Unauthorized Access.");

        
        const folder = await ctx.db.get(args.id);

        if (!folder || folder.userId !== user._id) {
            throw new Error("Unauthorized: You do not have permission to delete this folder.");
            }

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