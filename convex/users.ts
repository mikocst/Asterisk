import { mutation } from "./_generated/server";

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Cannot provision user: Unauthenticated token identifier.");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existingUser !== null) {
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      name: identity.name ?? "Anonymous Asterisk User",
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email ?? "",
    });
  },
});