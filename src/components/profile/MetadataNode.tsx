'use client';

import React from 'react';
import { LucideIcon, X } from 'lucide-react';

interface MetadataNodeProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick?: () => void;
}

export default function MetadataNode({ icon: Icon, label, value, onClick }: MetadataNodeProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left group/node p-4 rounded-3xl bg-slate-50/50 dark:bg-white/[0.02] border border-transparent hover:border-blue-500/20 hover:bg-white dark:hover:bg-white/[0.04] transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/10 text-slate-400 group-hover/node:text-blue-500 group-hover/node:scale-110 transition-all shadow-sm">
          <Icon size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-0.5">{label}</span>
            <X size={8} className="text-slate-300 opacity-0 group-hover/node:opacity-100 rotate-45 transition-all" />
          </div>
          <span className="block text-xs font-bold text-slate-700 dark:text-slate-300 truncate tracking-tight">{value}</span>
        </div>
      </div>
    </button>
  );
}
