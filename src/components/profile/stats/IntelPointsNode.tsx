'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { User } from 'firebase/auth';

interface IntelPointsNodeProps {
  level: number;
  points: number;
  nextLevelProgress: number;
  user: User | null;
}

export function IntelPointsNode({ level, points, nextLevelProgress, user }: IntelPointsNodeProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 shadow-2xl relative overflow-hidden group"
    >
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-600/20 group-hover:rotate-12 transition-transform">
          <ShieldCheck size={20} />
        </div>
        <div className="text-right">
          <span className="block text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Your Rank</span>
          <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">LEVEL {level}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-8 relative z-10">
        <div className="space-y-1">
          <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            POINTS
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">
              {points}
            </span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">PTS</span>
          </div>
        </div>

        <div className="relative w-24 h-24 shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-slate-100 dark:text-slate-800"
            />
            <motion.circle
              cx="48" cy="48" r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray="251.2"
              initial={{ strokeDashoffset: 251.2 }}
              animate={{ strokeDashoffset: 251.2 - (251.2 * nextLevelProgress) / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="text-blue-600"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-black text-slate-900 dark:text-white">{Math.round(nextLevelProgress)}%</span>
            <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Next</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-white/[0.02] p-4 rounded-2xl border border-slate-100 dark:border-white/5 relative z-10 space-y-3">
        <div className="flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
          <span>Account ID</span>
          <span className="text-blue-600 dark:text-blue-400 font-mono">{user?.uid?.slice(0, 12).toUpperCase() || 'UNKNOWN'}</span>
        </div>
        <div className="h-px bg-slate-200 dark:bg-white/5" />
        <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <RefreshCw size={10} className="animate-spin-slow" />
          <span>Syncing your level...</span>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path d="M10,50 L90,50 M50,10 L50,90 M30,30 L70,70 M70,30 L30,70" stroke="currentColor" strokeWidth="1" fill="none" />
          <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      </div>
    </motion.div>
  );
}
