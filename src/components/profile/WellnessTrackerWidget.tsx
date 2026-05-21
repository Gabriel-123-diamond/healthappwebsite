'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Droplets, Smile, Bell, Plus, Check } from 'lucide-react';

export function WellnessTrackerWidget() {
  const trackers = [
    { id: 'water', label: 'Water Intake', value: 1.5, target: 2.5, unit: 'L', icon: <Droplets size={14} />, color: 'text-blue-500', bg: 'bg-blue-500' },
    { id: 'mood', label: 'Daily Mood', value: 'Positive', icon: <Smile size={14} />, color: 'text-amber-500', bg: 'bg-amber-500' },
  ];

  const reminders = [
    { id: '1', time: '08:00 AM', label: 'Multivitamin', taken: true },
    { id: '2', time: '01:00 PM', label: 'Omega-3', taken: false },
    { id: '3', time: '09:00 PM', label: 'Magnesium', taken: false },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Wellness Tracker</h3>
        <button className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-white/5 text-blue-600 shadow-sm hover:scale-110 transition-transform">
          <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {trackers.map((track) => (
          <div key={track.id} className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4 relative overflow-hidden group">
            <div className="flex justify-between items-start relative z-10">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${track.bg} text-white shadow-lg`}>
                {track.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${track.color}`}>{track.label}</span>
            </div>
            
            <div className="relative z-10">
              {track.id === 'water' ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {track.value}<span className="text-sm ml-1 text-slate-400">{track.unit}</span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Goal: {track.target}{track.unit}</p>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((track.value as any) / (track.target as any)) * 100}%` }}
                      className={`h-full ${track.bg} rounded-full`}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{track.value}</p>
                  <div className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-900/20 text-amber-600 text-[8px] font-black uppercase tracking-widest">Great Day</div>
                </div>
              )}
            </div>

            <div className={`absolute -bottom-8 -right-8 w-24 h-24 ${track.bg} opacity-[0.03] rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Bell size={20} />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Medication Reminders</h4>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Schedule</p>
          </div>
        </div>

        <div className="space-y-4">
          {reminders.map((rem) => (
            <div key={rem.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-500/30 transition-all cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${rem.taken ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-900 text-slate-300 group-hover:text-indigo-500'}`}>
                  {rem.taken ? <Check size={16} strokeWidth={4} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">{rem.label}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{rem.time}</p>
                </div>
              </div>
              {!rem.taken && (
                <button className="px-4 py-2 bg-white dark:bg-slate-900 text-indigo-600 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm hover:bg-indigo-600 hover:text-white transition-all">
                  Take Now
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
