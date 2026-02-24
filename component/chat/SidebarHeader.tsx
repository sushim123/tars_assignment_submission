"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { usePresence } from "@/hooks/usePresence";
export default function SidebarHeader() {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [profileClicked, setProfileClicked] = useState(false);
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
        <div className="relative">
          <div className="relative group">
            <div className="absolue inset-0 gap-5 bg-indigo-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            <img
              onClick={() => setProfileClicked((prev) => !prev)}
              src={user.imageUrl}
              alt={user.fullName ?? "User"}
              className="w-9 h-9 rounded-full border border-white/20 object-cover relative z-10"
            />
          </div>
          {profileClicked && (
            <div className="justify-center flex flex-col p-2  absolute right-0 mt-2 h-56   w-60 rounded-2xl bg-gray-600/30 border">
              <p className="text-gray-950 bg-gray-200/40 mb-2 p-2 rounded-2xl ">Name: {user.fullName}</p>
              <p className="text-gray-950 bg-gray-200/50 mb-2 p-2 rounded-2xl">Email: {user.emailAddresses[0].emailAddress}</p>
              <p className="text-gray-950 bg-gray-200/50 mb-2 p-2 rounded-2xl">Account: {user?.createdAt?.toDateString()}</p>
              <button className="text-red-600 font-bold bg-red-400/20 mb-2 p-2 rounded-2xl">Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
