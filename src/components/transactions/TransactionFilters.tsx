'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface TransactionFiltersProps {
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
  statusFilter: 'all' | 'success' | 'pending' | 'failed';
  setStatusFilter: (status: 'all' | 'success' | 'pending' | 'failed') => void;
  dateFilter: 'all' | 'today' | 'week' | 'month' | 'year';
  setDateFilter: (date: 'all' | 'today' | 'week' | 'month' | 'year') => void;
}

export function TransactionFilters({
  isFilterOpen,
  setIsFilterOpen,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter
}: TransactionFiltersProps) {
  const t = useTranslations('transactions');

  return (
    <>
      <button 
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isFilterOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-white/5'}`}
      >
        <ListFilter size={14} />
        {t('filters')}
        {(statusFilter !== 'all' || dateFilter !== 'all') && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-1" />
        )}
      </button>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl flex flex-wrap gap-8 items-center justify-between">
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('statusFilter')}</label>
                  <div className="flex gap-2">
                     {['all', 'success', 'pending', 'failed'].map((s) => (
                       <button 
                         key={s}
                         onClick={() => setStatusFilter(s as any)}
                         className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${statusFilter === s ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                       >
                         {s}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t('dateFilter')}</label>
                  <div className="flex gap-2">
                     {['all', 'today', 'week', 'month', 'year'].map((d) => (
                       <button 
                         key={d}
                         onClick={() => setDateFilter(d as any)}
                         className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${dateFilter === d ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                       >
                         {d}
                       </button>
                     ))}
                  </div>
               </div>

               <button 
                 onClick={() => { setStatusFilter('all'); setDateFilter('all'); }}
                 className="text-[9px] font-black text-red-500 uppercase tracking-widest hover:underline pt-6"
               >
                 {t('resetFilter')}
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
