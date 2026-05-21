import React from 'react';
import { Loader2 } from 'lucide-react';

export const CallConnecting: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center pt-32 sm:pt-40 transition-colors">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
        <Loader2 className="w-16 h-16 animate-spin text-blue-600 relative z-10" />
      </div>
      <p className="mt-8 text-slate-900 dark:text-white font-black uppercase tracking-[0.3em] text-xs">Securing Node Connection...</p>
    </div>
  );
};
