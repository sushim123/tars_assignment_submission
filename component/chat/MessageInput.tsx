"use client";

import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface MessageInputProps {
  conversationId: Id<"conversations">;
}

export default function MessageInput({ conversationId }: MessageInputProps) {
  const [content, setContent] = useState("");
  const sendMessage = useMutation(api.messages.send);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const setTyping = useMutation(api.users.setTyping);
  const handleSend = async () => {
    if (!content.trim()) return;

    try {
      await sendMessage({
        conversationId,
        content: content.trim(),
      });
      setContent("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value.length > 0) {
      setTyping();
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="p-4  bg-transparent border-t border-white/5">
      <div className="flex items-end gap-3 bg-white/3 border border-white/10 rounded-2xl p-2 focus-within:border-indigo-500/50 transition-all duration-300">
        

        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          rows={1}
          className="w-full pl-2 bg-transparent text-sm text-zinc-100 resize-none outline-none py-2 max-h-32 custom-scrollbar"
        />

        <div className="flex items-center gap-1">
          <button
            onClick={handleSend}
            disabled={!content.trim()}
            className={`p-2 rounded-xl transition-all duration-300 ${
              content.trim()
                ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] scale-100"
                : "bg-white/5 text-zinc-600 scale-90 opacity-50"
            }`}
          >
            <Icon icon="solar:plain-2-bold" width={20} />
          </button>
        </div>
      </div>

      <p className="text-[10px] text-zinc-600 mt-2 text-center uppercase tracking-widest font-medium">
        Press Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
}
