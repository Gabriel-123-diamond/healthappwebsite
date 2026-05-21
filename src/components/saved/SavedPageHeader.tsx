'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, RefreshCw, Loader2, Trash2 } from 'lucide-react';
import DateRangePicker from '@/components/common/DateRangePicker';

interface SavedPageHeaderProps {
  t: any;
  handleClearAll: () => void;
  isClearing: boolean;
  activeTab: 'items' | 'searches';
  filteredItemsLength: number;
  filteredSearchesLength: number;
  handleSync: () => void;
  syncing: boolean;
  startDate: string;
  endDate: string;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
}

export function SavedPageHeader({
  t,
  handleClearAll,
  isClearing,
  activeTab,
  filteredItemsLength,
  filteredSearchesLength,
  handleSync,
  syncing,
  startDate,
  endDate,
  setStartDate,
  setEndDate
}: SavedPageHeaderProps) {
  return (
    <header className="mb-12 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20">
            <Bookmark className="w-6 h-6 text-white" />
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Encrypted Vault</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
          {t.saved.title}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium mt-2">{t.saved.subtitle}</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-wrap items-center gap-3 w-full xl:w-auto"
      >
        <button 
          onClick={handleClearAll}
          disabled={isClearing || (activeTab === 'items' ? filteredItemsLength === 0 : filteredSearchesLength === 0)}
          className="flex items-center gap-2 bg-white dark:bg-[#0B1221] px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-30 text-[10px] font-black uppercase tracking-widest shadow-sm"
        >
          {isClearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Wipe Vault
        </button>

        <button 
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 bg-white dark:bg-[#0B1221] px-5 py-3 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm hover:bg-slate-50 dark:hover:bg-blue-900/20 transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={`${syncing ? 'animate-spin' : ''} text-blue-600`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Sync Node</span>
        </button>

        <div className="min-w-[240px] flex-1 sm:flex-none">
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
            placeholder="Temporal Filter"
          />
        </div>
      </motion.div>
    </header>
  );
}
