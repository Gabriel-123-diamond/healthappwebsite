'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';

interface SavedControlsProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeTab: 'items' | 'searches';
  setActiveTab: (val: 'items' | 'searches') => void;
  filteredItemsLength: number;
  filteredSearchesLength: number;
}

export function SavedControls({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  filteredItemsLength,
  filteredSearchesLength
}: SavedControlsProps) {
  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-12"
      >
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search in your saved library..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 text-base font-bold bg-white dark:bg-[#0B1221] border-2 border-slate-100 dark:border-white/5 focus:border-blue-500/50 rounded-3xl outline-none shadow-xl shadow-slate-200/50 dark:shadow-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 p-2 bg-slate-50 dark:bg-white/5 rounded-xl">
            <Sparkles size={14} className="text-slate-300" />
          </div>
        </div>
      </motion.div>

      <div className="flex gap-10 mb-10 border-b border-slate-200 dark:border-white/5 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('items')}
          className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 shrink-0 ${activeTab === 'items' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-blue-600'}`}
        >
          Clinical Assets ({filteredItemsLength})
        </button>
        <button 
          onClick={() => setActiveTab('searches')}
          className={`pb-4 px-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-4 shrink-0 ${activeTab === 'searches' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 dark:text-slate-500 hover:text-blue-600'}`}
        >
          AI Syntheses ({filteredSearchesLength})
        </button>
      </div>
    </>
  );
}
