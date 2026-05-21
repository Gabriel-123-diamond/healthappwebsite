import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

interface RankEvolutionProps {
  t: any;
  referralPoints: number;
  currentRank: number;
  setShowRankDetails: (val: boolean) => void;
}

export function RankEvolution({
  t,
  referralPoints,
  currentRank,
  setShowRankDetails,
}: RankEvolutionProps) {
  return (
    <div className="max-w-md mx-auto mb-12 space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg text-white shadow-lg shadow-amber-500/20">
            <Trophy size={16} strokeWidth={3} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('networkAuthority')}</p>
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('rank')} {currentRank}</h3>
              <button 
                onClick={() => setShowRankDetails(true)}
                className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
              >
                <Sparkles size={10} /> {t('viewTiers')}
              </button>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">{t('ptsToEvolve', { pts: 500 - ((referralPoints || 0) % 500) })}</p>
          <div className="flex items-center justify-end gap-1">
            <Sparkles size={12} className="text-amber-500 animate-pulse" />
            <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t('level')} {currentRank}</span>
          </div>
        </div>
      </div>

      <div className="relative h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-slate-200/50 dark:border-white/10 shadow-inner">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${((referralPoints || 0) % 500) / 5}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 rounded-full relative"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
        </motion.div>
      </div>
      
      <div className="flex justify-between items-center px-2">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('currentMilestone')}</span>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('nextEvolution')}</span>
      </div>
    </div>
  );
}
