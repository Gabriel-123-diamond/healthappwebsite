'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserJournals, JournalEntry } from '@/services/journalService';
import { Loader2, BarChart2, List, ChevronLeft } from 'lucide-react';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalHistoryList from '@/components/journal/JournalHistoryList';
import JournalTrendsChart from '@/components/journal/JournalTrendsChart';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export default function JournalPage() {
  const t = useTranslations('journalPage');
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'trends'>('list');

  const fetchEntries = async () => {
    if (!auth.currentUser) return;
    try {
      const data = await getUserJournals(auth.currentUser.uid);
      setEntries(data);
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchEntries();
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24">
      <div className="max-w-6xl mx-auto px-4">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
              {t('badge')}
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">{t('title')}</h1>
            <p className="text-slate-50 dark:text-slate-400 font-medium">{t('subtitle')}</p>
          </div>
          
          <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'list' 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-blue-600'
              }`}
            >
              <List className="w-4 h-4" />
              {t('history')}
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                viewMode === 'trends' 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                  : 'text-slate-400 hover:text-blue-600'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              {t('trends')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Add Entry Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-32">
              <JournalEntryForm onEntryAdded={fetchEntries} />
            </div>
          </div>

          {/* History List or Trends Chart */}
          <div className="lg:col-span-8 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t('decrypting')}</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {viewMode === 'list' ? (
                    <JournalHistoryList entries={entries} />
                  ) : (
                    <JournalTrendsChart entries={entries} />
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
