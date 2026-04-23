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
    isFavorited: v.boolean(),
    folder: v.string(),
    folderId: v.union(v.string(), v.null()),
    deletedAt: v.optional(v.string()),
    lastModified: v.number(),
  }).index("by_user", ["userId"]),
});