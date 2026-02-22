"use client";

import { Icon } from "@iconify/react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link"; // Added for navigation

interface ChatHeaderProps {
  conversationId: string; // Passed from the URL params
}

export default function ChatHeader({ conversationId }: ChatHeaderProps) {
  // Fetch the recipient's info using our new query
  const otherUser = useQuery(api.conversations.getById, {
    conversationId: conversationId as Id<"conversations">,
  });

  // Loading State
  if (otherUser === undefined) {
    return (
      <header className="h-16 flex items-center px-6 border-b border-white/5 bg-[#0a0a0a]/40 backdrop-blur-md animate-pulse" />
    );
  }

  const isOnline = otherUser?.lastSeen
    ? Date.now() - otherUser.lastSeen < 10000
    : false;

  const formatLastSeen = () => {
    if (isOnline) return "Active Now";
    if (!otherUser?.lastSeen) return "Offline";

    const diff = Math.floor((Date.now() - otherUser.lastSeen) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return "Offline";
  };

  return (
    <header className="h-16 flex items-center px-4 md:px-6 border-b border-white/5 bg-[#0a0a0a]/40 backdrop-blur-md sticky top-0 z-50 shrink-0">
      <div className="flex items-center gap-3 w-full">
        <Link
          href="/"
          className="md:hidden p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
        >
          <Icon icon="solar:alt-arrow-left-linear" width={24} />
        </Link>

        <div className="relative">
          <img
            src={otherUser?.image || "https://i.pravatar.cc/150"}
            className="w-10 h-10 rounded-full border border-white/10 object-cover"
            alt={otherUser?.name}
          />
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
          )}
        </div>

        <div className="flex flex-col">
          <h2 className="text-sm font-semibold text-zinc-100 tracking-tight">
            {otherUser?.name || "User"}
          </h2>
          <div className="flex items-center gap-1.5">
            {isOnline && (
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            )}
            <p
              className={`text-[10px] font-bold uppercase tracking-widest ${isOnline ? "text-emerald-500" : "text-zinc-500"}`}
            >
              {formatLastSeen()}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
