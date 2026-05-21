'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, TrendingUp, Users, Heart } from 'lucide-react';

export function HolisticProgressWidget() {
  const stats = [
    { label: 'Client Energy Levels', value: '+15%', color: 'text-emerald-500' },
    { label: 'Pain Reduction Avg', value: '-22%', color: 'text-blue-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Heart size={14} className="text-rose-500" /> Holistic Progress
        </h3>
        <TrendingUp size={16} className="text-emerald-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-1">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-tight">{stat.label}</p>
            <p className={`text-lg font-black uppercase tracking-tight ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">Outcome Satisfaction</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">92%</p>
        </div>
        <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '92%' }}
            className="h-full bg-rose-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
