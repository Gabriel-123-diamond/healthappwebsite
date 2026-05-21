'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProtocolStatusNodeProps {
  tierName: string;
  timeLeft: any;
}

export function ProtocolStatusNode({ tierName, timeLeft }: ProtocolStatusNodeProps) {
  const router = useRouter();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => !timeLeft && router.push('/upgrade')}
      className={`bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group ${!timeLeft ? 'cursor-pointer' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.03] to-transparent h-[200%] -translate-y-full group-hover:translate-y-full transition-transform duration-[3000ms] pointer-events-none" />
      
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className={`p-3 rounded-2xl ${timeLeft ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'} text-white shadow-xl shadow-amber-500/20 group-hover:scale-110 transition-transform`}>
          <Zap size={20} fill="currentColor" />
        </div>
        <div className="text-right">
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Account Plan</span>
          <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{tierName} LEVEL</span>
        </div>
      </div>

      <div className="relative z-10">
        <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">
          MY STATUS
        </h4>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${timeLeft ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-700'}`} />
            <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${timeLeft ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
              {timeLeft ? 'Premium Active' : 'Basic Plan'}
            </span>
          </div>
          <div className="px-2 py-0.5 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Security: {timeLeft ? 'High' : 'Standard'}</span>
          </div>
        </div>

        {timeLeft ? (
          <div className="space-y-6">
            <div className="flex items-baseline justify-between gap-2">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Time Remaining</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">
                  {timeLeft.days}D {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-amber-500 tabular-nums">
                  :{String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>
            
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (timeLeft.totalSeconds / (30 * 24 * 3600)) * 100)}%` }}
                className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button className="w-full py-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
              Upgrade My Plan
            </button>
            <div className="flex items-center gap-2 px-1">
              <ShieldCheck size={10} className="text-slate-300" />
              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Standard security active</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 opacity-10 pointer-events-none">
        <svg viewBox="0 0 400 100" className="w-full h-full preserve-3d">
          <motion.path
            d="M0,50 Q50,20 100,50 T200,50 T300,50 T400,50"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-amber-500"
            animate={{
              d: [
                "M0,50 Q50,20 100,50 T200,50 T300,50 T400,50",
                "M0,50 Q50,80 100,50 T200,50 T300,50 T400,50",
                "M0,50 Q50,20 100,50 T200,50 T300,50 T400,50"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
}
