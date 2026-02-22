import { v } from "convex/values"; // Added this
import { query, mutation } from "./_generated/server"; // Added mutation here

// convex/users.ts
export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const users = await ctx.db.query("users").collect();

    return users
      .filter((u) => u.clerkId !== identity.subject)
      .map((u) => ({
        _id: u._id,
        name: u.name,
        image: u.image,
        lastSeen: u.lastSeen, 
      }));
  },
});

export const updatePresence = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

 
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user) {
     
      await ctx.db.patch(user._id, { lastSeen: Date.now() });
    }
  },
});
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
  },
  handler: async (ctx, args) => {

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      name: args.name,
      email: args.email,
      image: args.image,
      
    });
  },
});


export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});


export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    if (!args.searchTerm) return [];

    const users = await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", args.searchTerm))
      .collect();

   
    return users.filter((u) => u.clerkId !== identity.subject);
  },
});

export const setTyping = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, { typingUntil: Date.now() + 3000 });
    }
  },
});

export const getTypingStatus = query({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.otherUserId);
    if (!user || !user.typingUntil) return false;
    return Date.now() < user.typingUntil;
  },
});