import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),

  notes: defineTable({
    title: v.string(),
    userId: v.id('users'), 
    blocks: v.optional(v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        content: v.string(),
      })
    )),
    lexicalData: v.optional(v.string()),
    preview: v.optional(v.string()),
    isFavorited: v.boolean(), 
    folder: v.string(),      
    folderId: v.union(v.id("folders"), v.null()), 
    lastModified: v.number(),
    deletedAt: v.optional(v.string()), 
  })
  .index("by_user", ["userId"])
  .index("by_folderId", ["folderId"]),

  folders: defineTable({
    title: v.string(),
    userId: v.id('users')
  }).index("by_user", ["userId"])
});