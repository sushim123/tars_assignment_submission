"use client";

import { use } from "react";
import ChatArea from "@/component/chat/ChatArea";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConversationPage({ params }: PageProps) {

  const resolvedParams = use(params);
  const conversationId = resolvedParams.id;

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden">
      <ChatArea conversationId={conversationId} />
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[20%] w-125 h-125 bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] right-[10%] w-100 h-100 bg-emerald-500/5 blur-[100px] rounded-full" />
      </div>
    </div>
  );
}
