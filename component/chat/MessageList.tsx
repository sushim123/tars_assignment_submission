"use client";

import { useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Icon } from "@iconify/react";

// --- Helper for Smart Timestamps ---
const formatTimestamp = (time: number) => {
  const date = new Date(time);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isDifferentYear = date.getFullYear() !== now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (isDifferentYear) {
    return date.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleDateString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Message {
  _id: Id<"messages">;
  senderId: string;
  content: string;
  _creationTime: number;
  reactions?: Array<{
    emoji: string;
    userId: Id<"users">;
  }>;
  isDeleted?: boolean; 
}

interface MessageListProps {
  messages: Message[] | undefined;
  otherUserId: Id<"users">;
}

const EMOJI_OPTIONS = ["😲"];

export default function MessageList({
  messages,
  otherUserId,
}: MessageListProps) {
  const dbUser = useQuery(api.users.currentUser);
  const toggleReaction = useMutation(api.messages.toggleReaction);
  const deleteMessage = useMutation(api.messages.deleteMessage);
  const isTyping = useQuery(
    api.users.getTypingStatus,
    otherUserId ? { otherUserId } : "skip"
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;

    const isAtBottom = scrollHeight - scrollTop - clientHeight < 150;
    setShowScrollButton(!isAtBottom);
  };

  useEffect(() => {
    if (!showScrollButton) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  if (messages === undefined) return null;

  return (
    <div className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 scrollbar-hide"
      >
        <div className="flex flex-col gap-6 min-h-full mt-20">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center opacity-30">
              <p className="text-xs uppercase tracking-widest">
                No messages yet
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === dbUser?._id;
              const isDeleted = msg.isDeleted === true

              return (
                <div
                  key={msg._id}
                  className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className="relative group max-w-[75%] flex flex-col gap-1">
                    
                    {!isDeleted && (
                      <div
                        className={`
                          absolute -top-10 flex items-center gap-1 bg-zinc-900/90 border border-white/10 p-1 rounded-full 
                          opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 backdrop-blur-sm
                          ${isMe ? "right-0 flex-row-reverse" : "left-0"}
                        `}
                      >
                        
                        <div className="flex gap-0.5 px-1 border-r border-white/10 mr-1">
                          {EMOJI_OPTIONS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => toggleReaction({ messageId: msg._id, emoji })}
                              className="hover:bg-white/20 p-1 rounded-full text-sm transition-transform hover:scale-125"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>

                        {isMe && (
                          <button
                            onClick={() => {
                              if(confirm("Delete this message?")) {
                                deleteMessage({ messageId: msg._id });
                              }
                            }}
                            className="p-1.5 hover:bg-red-500/20 text-zinc-400 hover:text-red-500 rounded-full transition-colors"
                          >
                            <Icon icon="solar:trash-bin-trash-linear" width={16} />
                          </button>
                        )}
                      </div>
                    )}

                  
                    <div
                      className={`px-4 py-2.5 rounded-2xl text-sm transition-all duration-300 ${
                        isMe
                          ? "bg-indigo-600 text-white rounded-tr-none shadow-[0_10px_20px_-5px_rgba(79,70,229,0.3)]"
                          : "bg-white/5 text-zinc-200 border border-white/10 rounded-tl-none backdrop-blur-md"
                      } ${isDeleted ? "opacity-40 border-dashed" : ""}`}
                    >
                      <p className={`leading-relaxed whitespace-pre-wrap wrap-break-words overflow-hidden ${isDeleted ? "italic text-zinc-400" : ""}`}>
                        {isDeleted ? "This message was deleted" : msg.content}
                      </p>
                      <div
                        className={`text-[10px] mt-1 opacity-40 tabular-nums ${
                          isMe ? "text-right" : "text-left"
                        }`}
                      >
                        {formatTimestamp(msg._creationTime)}
                      </div>
                    </div>

                
                    {!isDeleted && msg.reactions && msg.reactions.length > 0 && (
                      <div
                        className={`flex flex-wrap gap-1 mt-1 ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        {Object.entries(
                          msg.reactions.reduce(
                            (acc: Record<string, number>, curr) => {
                              acc[curr.emoji] = (acc[curr.emoji] || 0) + 1;
                              return acc;
                            },
                            {},
                          ),
                        ).map(([emoji, count]) => (
                          <button
                            key={emoji}
                            onClick={() => toggleReaction({ messageId: msg._id, emoji })}
                            className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[10px] flex items-center gap-1 hover:bg-white/10 transition-colors"
                          >
                            <span>{emoji}</span>
                            <span className="text-zinc-400">{count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

         
          {isTyping && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-2xl rounded-tl-none flex items-center gap-2 backdrop-blur-md">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
                </div>
                <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                  Typing
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 z-50 text-[11px] font-bold uppercase tracking-wider"
        >
          <Icon icon="solar:alt-arrow-down-linear" width={16} />
          New messages
        </button>
      )}
    </div>
  );
}