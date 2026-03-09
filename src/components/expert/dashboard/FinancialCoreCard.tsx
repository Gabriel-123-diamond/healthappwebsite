import React from 'react';
import { Wallet, TrendingUp, Activity } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { RevenueForecast } from '@/components/expert/RevenueForecast';

interface FinancialCoreCardProps {
  points?: string | number;
}

export const FinancialCoreCard: React.FC<FinancialCoreCardProps> = ({ points }) => {
  return (
    <div className="relative p-[1px] bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-500/20 dark:from-blue-400/30 dark:via-indigo-400/30 dark:to-purple-400/30 rounded-[42px] transition-all duration-500">
      <div className="p-8 bg-white/80 dark:bg-slate-900/90 backdrop-blur-3xl rounded-[41px] text-slate-900 dark:text-white shadow-2xl relative overflow-hidden group">
        {/* Mesh Gradients for Depth */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 dark:bg-blue-600/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 dark:bg-purple-600/20 rounded-full -ml-20 -mb-20 blur-3xl animate-pulse transition-all delay-700" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-600/10 dark:bg-blue-400/10 rounded-2xl border border-blue-500/20">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-600/50 dark:text-blue-400/50 mb-1">Live Node</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-300 bg-blue-500/10 dark:bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/20">Financial Core</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Accumulated clinical Points</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
                {points || "0"}
              </h3>
              <span className="text-sm font-black text-blue-600 dark:text-blue-400 tracking-widest uppercase">PTS</span>
            </div>
          </div>

          <div className="p-1 bg-slate-50/50 dark:bg-slate-950/50 rounded-3xl border border-slate-100 dark:border-white/5">
            <RevenueForecast />
          </div>

          <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-emerald-500/5 dark:bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/10">
              <TrendingUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">+18.4% APY</span>
            </div>
            <Link href="/expert/revenue" className="group/link flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
              Ledger 
              <div className="w-6 h-6 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center group-hover/link:bg-blue-600 group-hover/link:text-white transition-all">
                <Activity size={10} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
