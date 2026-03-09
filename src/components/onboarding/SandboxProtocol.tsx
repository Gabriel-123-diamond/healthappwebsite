import React from 'react';
import { Sparkles } from 'lucide-react';

export function SandboxProtocol() {
  return (
    <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-blue-600 shadow-sm font-black">
          123
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Sandbox Protocol</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white">Use PIN: <span className="font-mono text-lg ml-1">123456</span></p>
        </div>
      </div>
      <Sparkles className="w-6 h-6 text-blue-400 animate-pulse hidden sm:block" />
    </div>
  );
}
