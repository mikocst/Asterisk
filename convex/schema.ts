import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  notes: defineTable({
    title: v.string(),
    userId: v.string(), 
    blocks: v.array(
      v.object({
        id: v.string(),
        type: v.string(), 
        content: v.string(),
      })
    ),
    lexicalData: v.optional(v.string()),
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
    userId: v.string()
  }).index("by_user", ["userId"])
});