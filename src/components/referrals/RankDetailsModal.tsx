import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';

interface Tier {
  rank: number;
  name: string;
  range: string;
  desc: string;
}

interface RankDetailsModalProps {
  showRankDetails: boolean;
  setShowRankDetails: (val: boolean) => void;
  t: any;
  rankTiers: Tier[];
  currentRank: number;
}

export function RankDetailsModal({
  showRankDetails,
  setShowRankDetails,
  t,
  rankTiers,
  currentRank,
}: RankDetailsModalProps) {
  return (
    <AnimatePresence>
      {showRankDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRankDetails(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0B1221] rounded-[40px] shadow-3xl border border-slate-100 dark:border-white/5 overflow-hidden"
          >
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('authorityTiers')}</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('evolutionPath')}</p>
                </div>
                <button 
                  onClick={() => setShowRankDetails(false)}
                  className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
                >
                  <ChevronLeft className="rotate-180" size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {rankTiers.map((tier) => (
                  <div 
                    key={tier.rank}
                    className={`p-5 rounded-3xl border transition-all ${
                      currentRank === tier.rank 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 ring-4 ring-blue-500/5' 
                        : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                          currentRank === tier.rank ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {tier.rank}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{tier.name}</h4>
                          <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{tier.range}</p>
                        </div>
                      </div>
                      {currentRank === tier.rank && (
                        <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                          {t('active')}
                        </div>
                      )}
                    </div>
                    <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {tier.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
