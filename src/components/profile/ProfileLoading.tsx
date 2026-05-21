import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProfileLoading = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-slate-500 font-black uppercase tracking-widest text-[9px]">Loading your profile...</p>
    </div>
  );
};
