"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useEffect } from "react";

interface ChatAreaProps {
  conversationId: string;
}

export default function ChatArea({ conversationId }: ChatAreaProps) {
  const dbUser = useQuery(api.users.currentUser);

  const messages = useQuery(api.messages.list, {
    conversationId: conversationId as Id<"conversations">,
  });

  const conversation = useQuery(api.conversations.get, {
    id: conversationId as Id<"conversations">,
  });

  const markAsRead = useMutation(api.conversations.markAsRead);

  const otherUserId =
    conversation && dbUser
      ? conversation.participantOne === dbUser._id
        ? conversation.participantTwo
        : conversation.participantOne
      : undefined;

  useEffect(() => {
    if (!conversationId) return;

    markAsRead({ conversationId: conversationId as Id<"conversations"> }).catch(
      (err) => console.error("Failed to mark as read:", err)
    );
  }, [conversationId, messages?.length, markAsRead]);

  return (
  
    <main className="flex-1 flex flex-col h-screen bg-[#0a0a0a]/40 backdrop-blur-3xl relative overflow-hidden border-l border-white/5">
    
      <ChatHeader conversationId={conversationId as Id<"conversations">} />
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        {messages === undefined || otherUserId === undefined ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <MessageList otherUserId={otherUserId} messages={messages} />
        )}
      </div>
      <div className="bg-white/5 backdrop-blur-2xl border-t border-white/10 p-4 pb-6 mt-auto">
        <MessageInput conversationId={conversationId as Id<"conversations">} />
      </div>
    </main>
  );
}