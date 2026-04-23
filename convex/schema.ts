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
    lastModified: v.number(),
  }).index("by_user", ["userId"]),
});