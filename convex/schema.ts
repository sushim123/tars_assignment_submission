import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.string(),
    lastSeen: v.optional(v.number()),
    typingUntil: v.optional(v.number()),
  })
    .index("by_clerkId", ["clerkId"])
    .searchIndex("search_name", {
      searchField: "name",
    }),

  conversations: defineTable({
    participantOne: v.id("users"),
    participantTwo: v.id("users"),
    lastReadOne: v.optional(v.number()),
    lastReadTwo: v.optional(v.number()),
  }).index("by_participants", ["participantOne", "participantTwo"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    isDeleted: v.optional(v.boolean()),
    reactions: v.optional(
      v.array(
        v.object({
          emoji: v.string(),
          userId: v.id("users"),
        }),
      ),
    ),
  }).index("by_conversation", ["conversationId"]),
});
