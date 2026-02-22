import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Helper to get current user - keeps code DRY (Don't Repeat Yourself)
async function getCurrentUser(ctx: any) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_clerkId", (q: any) => q.eq("clerkId", identity.subject))
    .unique();
}

export const send = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: user._id,
      content: args.content,
    });
  },
});

export const toggleReaction = mutation({
  args: {
    messageId: v.id("messages"),
    emoji: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Unauthorized");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    const reactions = message.reactions ?? [];

    const existingIndex = reactions.findIndex(
      (r) => r.emoji === args.emoji && r.userId === user._id,
    );

    if (existingIndex > -1) {
      reactions.splice(existingIndex, 1);
    } else {
      reactions.push({ emoji: args.emoji, userId: user._id });
    }

    await ctx.db.patch(args.messageId, { reactions });
  },
});

export const list = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();
  },
});

// convex/messages.ts

export const deleteMessage = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    // 1. Get the Clerk Identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // 2. Find the actual user document in your Convex 'users' table
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found in database");

    
    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    if (message.senderId !== user._id) {
     
      throw new Error("Unauthorized: You can only delete your own messages");
    }

    // 5. Perform the soft delete
    await ctx.db.patch(args.messageId, {
      content: "This message was deleted",
      isDeleted: true,
      reactions: [], 
    });
  },
});