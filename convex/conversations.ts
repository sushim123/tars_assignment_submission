import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreate = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) throw new Error("User not found");

    const existing = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("participantOne"), currentUser._id),
            q.eq(q.field("participantTwo"), args.otherUserId)
          ),
          q.and(
            q.eq(q.field("participantOne"), args.otherUserId),
            q.eq(q.field("participantTwo"), currentUser._id)
          )
        )
      )
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("conversations", {
      participantOne: currentUser._id,
      participantTwo: args.otherUserId,
      lastReadOne: Date.now(),
      lastReadTwo: Date.now(),
    });
  },
});

export const getById = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) return null;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    const otherUserId = conversation.participantOne === currentUser._id 
      ? conversation.participantTwo 
      : conversation.participantOne;

    const otherUser = await ctx.db.get(otherUserId);

    return {
      name: otherUser?.name,
      image: otherUser?.image,
      lastSeen: otherUser?.lastSeen,
    };
  },
});

export const get = query({
  args: { id: v.id("conversations") },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.id);
    if (!conversation) return null;

    const userOne = await ctx.db.get(conversation.participantOne);
    const userTwo = await ctx.db.get(conversation.participantTwo);

    return {
      ...conversation,
      userOne,
      userTwo,
    };
  },
});

export const markAsRead = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return;

    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return;

    if (conversation.participantOne === user._id) {
      await ctx.db.patch(args.conversationId, { lastReadOne: Date.now() });
    } else {
      await ctx.db.patch(args.conversationId, { lastReadTwo: Date.now() });
    }
  },
});

export const listWithUnread = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) return [];

    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => 
        q.or(
          q.eq(q.field("participantOne"), user._id),
          q.eq(q.field("participantTwo"), user._id)
        )
      )
      .collect();

    const results = await Promise.all(
      conversations.map(async (conv) => {
        const otherUserId = conv.participantOne === user._id 
          ? conv.participantTwo 
          : conv.participantOne;
        const otherUser = await ctx.db.get(otherUserId);
        
        const myLastRead = conv.participantOne === user._id 
          ? (conv.lastReadOne ?? 0) 
          : (conv.lastReadTwo ?? 0);

        // Fetch messages for this conversation
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversation", (q) => q.eq("conversationId", conv._id))
          .collect();

        // 1. Calculate unread count (Messages NOT sent by me AND after my last read)
        const unreadCount = messages.filter(
          (m) => m.senderId !== user._id && m._creationTime > myLastRead
        ).length;

        // 2. Get the last message timestamp for sorting the sidebar
        const lastMessageTime = messages.length > 0 
          ? messages[messages.length - 1]._creationTime 
          : conv._creationTime;

        return {
          ...conv,
          otherUser,
          unreadCount,
          lastMessageTime,
        };
      })
    );

    // Sort: Conversations with the newest messages appear at the top
    return results.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  },
});