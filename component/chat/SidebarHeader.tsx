"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { usePresence } from "@/hooks/usePresence";
export default function SidebarHeader() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (isLoaded && !userId) {
      redirect("/sign-in");
    }
  }, [isLoaded, userId]);
  usePresence();
  if (!isLoaded || !user) {
    return <div className="h-16 border-b border-white/10 animate-pulse" />;
  }

  return (
    <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 bg-white/2 backdrop-blur-md shrink-0">
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-[10px] tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.3)]">
          SUSHIM CHAT
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium text-white tracking-tight">
            {user.fullName}
          </div>
          
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">
              Online
            </span>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <img
            src={user.imageUrl}
            alt={user.fullName ?? "User"}
            className="w-9 h-9 rounded-full border border-white/20 object-cover relative z-10"
          />
        </div>
      </div>
    </div>
  );
}
