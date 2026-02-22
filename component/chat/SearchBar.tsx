import { Icon } from "@iconify/react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="p-4 border-b border-white/5 shrink-0 bg-[#0a0a0a]">
      <div className="relative flex items-center group">
        <Icon
          icon="solar:magnifer-linear"
          width={18}
          className={`absolute left-3 transition-colors duration-200 ${
            value ? "text-indigo-400" : "text-zinc-500"
          }`}
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search users..."
          className="w-full text-zinc-200 bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:border-indigo-500/50 focus:bg-white/10 placeholder:text-zinc-600 transition-all"
        />

       
        {value && (
          <button 
            onClick={() => onChange("")}
            className="absolute right-3 text-zinc-500 hover:text-zinc-200 transition-colors animate-in fade-in zoom-in duration-200"
          >
            <Icon icon="solar:close-circle-linear" width={18} />
          </button>
        )}
      </div>
    </div>
  );
}