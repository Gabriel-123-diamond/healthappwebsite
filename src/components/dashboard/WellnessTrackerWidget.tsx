'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Droplets, Moon, Sun, Plus } from 'lucide-react';

export function WellnessTrackerWidget() {
  const trackers = [
    { label: 'Hydration', value: '1.2L', target: '2.5L', icon: <Droplets size={14} />, color: 'bg-blue-500' },
    { label: 'Sleep', value: '6.5h', target: '8h', icon: <Moon size={14} />, color: 'bg-indigo-500' },
    { label: 'Mood', value: 'Great', icon: <Sun size={14} />, color: 'bg-amber-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Activity size={14} className="text-blue-600" /> Wellness Tracker
        </h3>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <Plus size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-6">
        {trackers.map((track) => (
          <div key={track.label} className="space-y-2">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <span className={track.color.replace('bg-', 'text-')}>{track.icon}</span>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{track.label}</p>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <span className="text-slate-900 dark:text-white">{track.value}</span>
                {track.target && ` / ${track.target}`}
              </p>
            </div>
            {track.target && (
              <div className="h-1.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '60%' }} // Mock progress
                  className={`h-full ${track.color} rounded-full`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
