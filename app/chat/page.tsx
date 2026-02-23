"use client"; // Important for interactivity

import ChatArea from "@/component/chat/ChatArea";
import { Icon } from "@iconify/react";

export default function ChatDashboard() {
  const conversationId = null; 

  return (
    <div className="flex h-screen w-full bg-[#09090b]">
      {conversationId ? (
        <ChatArea conversationId={conversationId} />
      ) : (
        <main className="flex-1 hidden md:flex flex-col items-center justify-center relative overflow-hidden">
          <div className="p-10 rounded-3xl border border-white/5 bg-white/2backdrop-blur-sm flex flex-col items-center gap-5 relative">
            <div className="absolute top-8 w-24 h-24 bg-indigo-500/20 blur-3xl rounded-full" />

            <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-indigo-500/20 to-purple-500/15 flex items-center justify-center relative border border-white/10">
              <Icon icon="solar:chat-round-line-linear" className="text-indigo-400" width={32} />
            </div>
            <div className="text-center">
              <h2 className="text-white font-semibold text-lg tracking-tight">Your Space</h2>
              <p className="text-zinc-500 text-xs mt-1.5 font-light">Select a friend to start a conversation</p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}