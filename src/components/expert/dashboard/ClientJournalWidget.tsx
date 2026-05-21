'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Book, Eye, Clock, User } from 'lucide-react';

export function ClientJournalWidget() {
  const journals = [
    { id: '1', client: 'Alice Johnson', type: 'Dietary Log', time: '1h ago' },
    { id: '2', client: 'Bob Smith', type: 'Meditation Journal', time: '3h ago' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Book size={14} className="text-teal-600" /> Client Journals
        </h3>
        <span className="text-[8px] font-black bg-teal-50 dark:bg-teal-900/20 text-teal-600 px-2 py-1 rounded-md">2 NEW</span>
      </div>

      <div className="space-y-4">
        {journals.map((j) => (
          <div key={j.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-teal-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-teal-600 transition-colors">
                  <User size={14} />
                </div>
                <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{j.client}</p>
              </div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Clock size={10} /> {j.time}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{j.type}</p>
              <button className="flex items-center gap-1 text-[8px] font-black text-teal-600 uppercase tracking-widest hover:underline">
                <Eye size={12} /> Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
