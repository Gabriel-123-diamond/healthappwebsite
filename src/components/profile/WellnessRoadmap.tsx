'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Footprints, Moon, Droplets, RefreshCw, CheckCircle2, Circle, Star, Calendar } from 'lucide-react';

export function WellnessRoadmap() {
  const milestones = [
    { id: '1', title: 'Daily Step Node', status: 'completed', val: '8,420', target: '10,000', icon: <Footprints size={14} />, color: 'bg-emerald-500' },
    { id: '2', title: 'Circadian Rhythm', status: 'current', val: '7h 12m', target: '8h', icon: <Moon size={14} />, color: 'bg-indigo-500' },
    { id: '3', title: 'Hydration Protocol', status: 'pending', val: '1.2L', target: '2.5L', icon: <Droplets size={14} />, color: 'bg-blue-500' },
    { id: '4', title: 'Clinical Sync', status: 'locked', icon: <CheckCircle2 size={14} />, color: 'bg-slate-400' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Star size={20} />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase text-slate-900 dark:text-white tracking-[0.2em]">Wellness Roadmap</h3>
            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Evolution Phase 2</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/5 shadow-sm">
           <Calendar size={12} className="text-indigo-500" />
           <span className="text-[9px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">May 2026</span>
        </div>
      </div>

      <div className="relative pl-8 space-y-12">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100 dark:bg-white/5" />

        {milestones.map((ms, idx) => (
          <motion.div 
            key={ms.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative"
          >
            {/* Status Node */}
            <div className={`absolute -left-[27px] top-0 w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 z-10 transition-colors ${
              ms.status === 'completed' ? 'bg-emerald-500' : 
              ms.status === 'current' ? 'bg-indigo-500 animate-pulse' : 
              'bg-slate-200 dark:bg-white/10'
            }`} />

            <div className={`p-8 rounded-[40px] border transition-all ${
              ms.status === 'current' 
                ? 'bg-white dark:bg-slate-900 border-indigo-500/20 shadow-2xl' 
                : 'bg-slate-50/50 dark:bg-white/5 border-transparent'
            }`}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${ms.color}`}>
                    {ms.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{ms.title}</h4>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                      {ms.status === 'completed' ? 'Node Verified' : ms.status === 'current' ? 'Active Tracking' : 'Queue Restricted'}
                    </p>
                  </div>
                </div>
                {ms.val && (
                  <div className="text-right">
                    <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{ms.val}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Goal: {ms.target}</p>
                  </div>
                )}
              </div>

              {ms.status === 'current' && (
                <div className="space-y-3">
                   <div className="h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '85%' }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                   </div>
                   <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-slate-400">
                      <span>Progress Load: 85%</span>
                      <span className="text-indigo-500">Approaching Milestone</span>
                   </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
