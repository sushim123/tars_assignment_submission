"use client";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ConversationItem({
  id,
  name,
  avatar,
  message,
  lastSeen,
  unreadCount,
}: any) {
  const [tick, setTick] = useState(0);
  const startChat = useMutation(api.conversations.getOrCreate);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 5000);
    return () => clearInterval(timer);
  }, []);
  const handleClick = async () => {
    try {
      const conversationId = await startChat({ otherUserId: id });
      router.push(`/conversations/${conversationId}`);
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };
  const getPresenceData = () => {
    if (!lastSeen) return { label: "Offline", isOnline: false };

    const now = Date.now();
    const diff = Math.floor((now - lastSeen) / 1000);

    if (diff <= 10) return { label: "Online", isOnline: true };

    if (diff < 60) return { label: `${diff}s ago`, isOnline: false };
    if (diff < 3600)
      return { label: `${Math.floor(diff / 60)}m ago`, isOnline: false };
    if (diff < 86400)
      return { label: `${Math.floor(diff / 3600)}h ago`, isOnline: false };

    return {
      label: new Date(lastSeen).toLocaleDateString([], {
        month: "short",
        day: "numeric",
      }),
      isOnline: false,
    };
  };

  const { label, isOnline } = getPresenceData();

  return (
    <div
      onClick={handleClick}
      className="group relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-500 hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/10 active:scale-[0.98]"
    >
      <div
        className={`absolute left-0 w-1 transition-all duration-300 rounded-full ${
          isOnline
            ? "h-8 bg-emerald-500 shadow-[0_0_10px_#10b981]"
            : "h-0 group-hover:h-6 bg-zinc-600"
        }`}
      />

      <div className="relative shrink-0">
        {isOnline && (
          <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full animate-pulse" />
        )}

        <img
          src={avatar}
          className={`w-12 h-12 rounded-full border object-cover z-10 relative transition-all duration-500 ${
            isOnline ? "border-emerald-500/50" : "border-white/10"
          }`}
          alt={name}
        />

        <div className="absolute bottom-0 right-0 z-20 flex h-3.5 w-3.5">
          {isOnline && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-3.5 w-3.5 border-2 transition-colors duration-500 ${
              isOnline ? "bg-emerald-500" : "bg-zinc-600"
            }`}
          ></span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h3
            className={`font-medium truncate transition-colors ${
              isOnline ? "text-white" : "text-gray-600 group-hover:text-white"
            }`}
          >
            {name}
          </h3>

          <span
            className={`text-[10px] font-bold uppercase tracking-tighter tabular-nums transition-colors ${
              isOnline
                ? "text-emerald-500"
                : "text-zinc-500 group-hover:text-white"
            }`}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <p className="text-xs text-zinc-500 truncate font-light leading-tight group-hover:text-zinc-400 transition-colors">
              {message}
            </p>
            {unreadCount > 0 && (
              <span className="text-[10px] text-indigo-400 font-medium animate-pulse">
                new message arrived
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <div className="ml-auto bg-indigo-600 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] animate-in zoom-in duration-300">
              {unreadCount}
            </div>
          )}
          <p className="text-xs text-zinc-500 truncate font-light leading-tight group-hover:text-zinc-400 transition-colors">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
