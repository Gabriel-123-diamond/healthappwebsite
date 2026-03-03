'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Calendar, RefreshCw, Search, Loader2, Trash2, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSavedContent } from '@/hooks/useSavedContent';
import { EmptyState } from '@/components/common/EmptyState';
import { SavedItemCard, SavedSearchCard } from '@/components/profile/SavedCards';
import DateRangePicker from '@/components/common/DateRangePicker';
import { useRouter } from 'next/navigation';

export default function SavedPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const {
    activeTab, setActiveTab,
    loading, syncing,
    startDate, setStartDate,
    endDate, setEndDate,
    searchQuery, setSearchQuery,
    filteredItems, filteredSearches,
    handleSync, deleteItem, deleteSearch,
    clearAllItems, clearAllSearches
  } = useSavedContent();

  const handleClearAll = async () => {
    const confirmMsg = activeTab === 'items' 
      ? "Permanently delete all saved articles and videos?"
      : "Permanently delete all saved AI responses?";
    
    if (!window.confirm(confirmMsg)) return;

    setIsClearing(true);
    try {
      if (activeTab === 'items') await clearAllItems();
      else await clearAllSearches();
    } catch (e) {
      alert("Failed to clear content");
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-32 sm:pt-40 pb-12 px-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3 tracking-tight">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-2xl shadow-sm">
                <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              {t.saved.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">{t.saved.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button 
              onClick={handleClearAll}
              disabled={isClearing || (activeTab === 'items' ? filteredItems.length === 0 : filteredSearches.length === 0)}
              className="flex items-center gap-2 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-30 h-[42px] text-xs font-black uppercase tracking-widest shadow-sm"
            >
              {isClearing ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Clear All
            </button>

            <button 
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 h-[42px]"
            >
              <RefreshCw size={16} className={`${syncing ? 'animate-spin' : ''} text-blue-600`} />
              <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">Sync</span>
            </button>

            <div className="min-w-[240px]">
              <DateRangePicker 
                startDate={startDate}
                endDate={endDate}
                onRangeChange={(start, end) => {
                  setStartDate(start);
                  setEndDate(end);
                }}
                placeholder="Filter by Date"
              />
            </div>
          </div>
        </header>

        <div className="relative mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search in your saved library..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-base font-bold bg-white dark:bg-slate-900 border-2 border-transparent focus:border-blue-500/50 rounded-2xl outline-none shadow-sm transition-all text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal"
            />
          </div>
        </div>

        <div className="flex gap-10 mb-8 border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('items')}
            className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'items' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Saved Items ({filteredItems.length})
          </button>
          <button 
            onClick={() => setActiveTab('searches')}
            className={`pb-4 px-2 text-xs font-black uppercase tracking-[0.2em] transition-all border-b-4 ${activeTab === 'searches' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Saved Searches ({filteredSearches.length})
          </button>
        </div>

        {activeTab === 'items' ? (
          filteredItems.length === 0 ? (
            <EmptyState text={searchQuery ? 'No matches' : t.saved.noSaved} icon={<Bookmark className="w-8 h-8 text-slate-300" />} desc={searchQuery ? 'Try a different search term.' : t.saved.noSavedDesc} />
          ) : (
            <motion.div layout className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <SavedItemCard key={item.id} item={item} onDelete={deleteItem} t={t} />
                ))}
              </AnimatePresence>
            </motion.div>
          )
        ) : (
          filteredSearches.length === 0 ? (
            <EmptyState text={searchQuery ? 'No matches' : "No saved searches"} icon={<Search className="w-8 h-8 text-slate-300" />} desc={searchQuery ? 'Try a different search term.' : "Save entire AI responses to see them here."} />
          ) : (
            <div className="space-y-4">
              {filteredSearches.map((search) => (
                <SavedSearchCard key={search.id} search={search} onDelete={() => deleteSearch(search.id)} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}