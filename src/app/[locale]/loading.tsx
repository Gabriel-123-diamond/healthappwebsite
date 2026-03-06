import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center transition-colors pt-32 sm:pt-40">
      <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center mb-8 animate-pulse shadow-xl">
        <span className="text-white font-bold text-5xl">H</span>
      </div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">HealthAI</h1>
      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="font-medium tracking-wide">Initializing Intelligence...</span>
      </div>
    </div>
  );
}
