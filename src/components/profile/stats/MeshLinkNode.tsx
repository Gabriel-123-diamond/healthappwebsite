import React from 'react';
import { motion } from 'framer-motion';
import { Network, Copy, Share2, Loader2, Zap, Activity } from 'lucide-react';

interface MeshLinkNodeProps {
  referralCode: string;
  generating: boolean;
  handleGenerate: (e: React.MouseEvent) => void;
  copyCodeOnly: (e: React.MouseEvent) => void;
  handleShare: (e: React.MouseEvent) => void;
}

export function MeshLinkNode({
  referralCode,
  generating,
  handleGenerate,
  copyCodeOnly,
  handleShare
}: MeshLinkNodeProps) {
  const hasCode = referralCode !== '...' && referralCode !== 'NO CODE';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group/mesh flex flex-col h-full justify-between"
    >

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10 w-full">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`absolute inset-0 rounded-2xl blur-md ${hasCode ? 'bg-emerald-500/40 animate-pulse' : 'bg-slate-400/20'}`} />
            <div className="relative p-3 sm:p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-lg">
              <Network className={hasCode ? "text-emerald-500" : "text-slate-400"} size={22} />
            </div>
          </div>
          <div>
            <h3 className="text-[10px] sm:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] mb-1">
              Invite Friends
            </h3>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${hasCode ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
              <span className={`text-[9px] font-bold uppercase tracking-widest ${hasCode ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {hasCode ? 'Link Active' : 'No Link'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col justify-center relative z-10 w-full min-h-[160px]">
        {!hasCode ? (
          <div className="flex flex-col items-center text-center py-2 px-2">
            <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-5 relative group-hover/mesh:scale-105 transition-transform duration-700 shadow-sm">
              <Activity className="text-slate-400 dark:text-slate-500 w-7 h-7" />
            </div>
            <h4 className="text-[12px] sm:text-[14px] font-black text-slate-800 dark:text-white uppercase tracking-widest mb-3">
              No Link Yet
            </h4>
            <p className="text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-semibold leading-relaxed mb-6 max-w-[280px]">
              Create an invite link to share with friends and earn points.
            </p>
            
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="relative w-full overflow-hidden group/genbtn rounded-2xl bg-slate-900 dark:bg-white p-[1.5px] transition-transform active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 shadow-xl shadow-indigo-500/10 mt-auto"
            >
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#818cf8_0%,#c084fc_50%,#818cf8_100%)] opacity-0 group-hover/genbtn:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center justify-center gap-3 w-full bg-slate-900 dark:bg-white rounded-[14px] py-4 sm:py-5 px-6">
                 {generating ? (
                   <Loader2 size={16} className="animate-spin text-white dark:text-slate-900" />
                 ) : (
                   <Zap size={16} className="text-white dark:text-slate-900 group-hover/genbtn:text-indigo-400 dark:group-hover/genbtn:text-indigo-600 transition-colors" />
                 )}
                 <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] text-white dark:text-slate-900">
                   {generating ? 'CREATING...' : 'CREATE INVITE LINK'}
                 </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-end h-full w-full">
            <div className="w-full bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden group/codeblock text-center flex flex-col items-center justify-center mb-5">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2">
                My Invite Code
              </span>
              <code className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-widest font-mono relative z-10 group-hover/codeblock:scale-105 transition-transform duration-500 w-full text-center">
                {referralCode}
              </code>
            </div>

            <div className="flex flex-col gap-3 w-full mt-auto">
              <button
                onClick={handleShare}
                className="group/actionbtn relative overflow-hidden w-full py-3.5 bg-blue-600 dark:bg-blue-600 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] text-white transition-all hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                <Share2 size={14} className="group-hover/actionbtn:scale-110 group-hover/actionbtn:-rotate-12 transition-transform duration-300" />
                <span>Share Link</span>
              </button>
              
              <button
                onClick={copyCodeOnly}
                className="group/actionbtn relative overflow-hidden w-full py-3.5 bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] text-slate-700 dark:text-white hover:bg-slate-100 dark:hover:bg-white/[0.08] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Copy size={13} className="group-hover/actionbtn:scale-110 transition-transform duration-300" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
