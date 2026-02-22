"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import SidebarHeader from "./SidebarHeader";
import SearchBar from "./SearchBar";
import ConversationItem from "./ConversationItem";
import { useState } from "react";

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const users = useQuery(api.users.getUsers);
  const searchResults = useQuery(api.users.searchUsers, {
    searchTerm: searchQuery,
  });
  const conversation = useQuery(api.conversations.listWithUnread);

  if (users === undefined || conversation === undefined) {
    return (
      <aside className="w-full md:w-80 lg:w-96 shrink-0 border-r border-white/10 flex flex-col h-full bg-[#0a0a0a] animate-pulse">
        <div className="p-6 text-zinc-500 font-light tracking-widest uppercase text-[10px]">
          Initializing...
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full md:w-80 lg:w-96 shrink-0 border-r border-white/5 flex flex-col h-full bg-[#0a0a0a] relative z-10">
      <div className="bg-white/2 backdrop-blur-md">
        <SidebarHeader />
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
        
        {searchQuery ? (
          searchResults?.length === 0 ? (
            <p className="p-8 text-center text-zinc-500 text-sm italic">
              No users found...
            </p>
          ) : (
            searchResults?.map((user) => (
              <ConversationItem
                key={user._id}
                name={user.name || "Anonymous"}
                avatar={user.image}
                id={user._id}
              />
            ))
          )
        ) : /* IF NOT SEARCHING: Show Active Conversations with Unread Badges */
        conversation.length === 0 ? (
          <p className="p-8 text-center text-zinc-500 text-sm italic">
            The silence is deafening...
          </p>
        ) : (
          conversation.map((conv, index) => (
            <div
              key={conv._id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ConversationItem
                name={conv.otherUser?.name || "Anonymous"}
                avatar={conv.otherUser?.image}
                lastSeen={conv.otherUser?.lastSeen}
                id={conv.otherUser?._id} 
                unreadCount={conv.unreadCount}
              />
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
