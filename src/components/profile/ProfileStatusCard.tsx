import React from 'react';

export const ProfileStatusCard: React.FC = () => {
  return (
    <div className="relative group/status w-full hidden sm:block">
      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-[36px] blur-xl opacity-0 group-hover/status:opacity-100 transition duration-1000" />
      <div className="relative p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[32px] sm:rounded-[40px] shadow-2xl overflow-hidden flex items-center gap-5 transition-all">
        {/* Background ambient light */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[40px] rounded-full pointer-events-none" />

        <div className="relative">
          <div className="absolute -inset-2 border border-emerald-500/20 rounded-2xl animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          </div>
        </div>
        <div className="flex-1 relative z-10">
          <span className="block text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">Connection</span>
          <span className="text-[12px] sm:text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Everything is working great</span>
        </div>
      </div>
    </div>
  );
};
