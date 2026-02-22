import ChatArea from "@/component/chat/ChatArea";
import Sidebar from "@/component/chat/Sidebar";
import { Icon } from "@iconify/react";


export default function Page() {
  const conversationId = null; 

  return (
    <div className="flex h-screen w-full bg-[#050505]">
      
      
      {conversationId ? (
        <ChatArea conversationId={conversationId} />
      ) : (
       
        <main className="flex-1 hidden md:flex flex-col items-center justify-center bg-[#0a0a0a]/40 backdrop-blur-3xl">
          <div className="p-8 rounded-3xl border border-white/5 bg-white/2 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center">
               <Icon icon="solar:chat-round-line-linear" className="text-indigo-400" width={32} />
            </div>
            <div className="text-center">
              <h2 className="text-zinc-200 font-medium">Your Space</h2>
              <p className="text-zinc-500 text-xs mt-1">Select a friend to start a conversation</p>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}