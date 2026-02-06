'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Calendar, RefreshCw, Search, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSavedContent } from '@/hooks/useSavedContent';
import { EmptyState } from '@/components/common/EmptyState';
import { SavedItemCard, SavedSearchCard } from '@/components/profile/SavedCards';

export default function SavedPage() {
  const { t } = useLanguage();
  const {
    activeTab, setActiveTab,
    loading, syncing,
    startDate, setStartDate,
    endDate, setEndDate,
    searchQuery, setSearchQuery,
    filteredItems, filteredSearches,
    handleSync, deleteItem, deleteSearch
  } = useSavedContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-xl">
                <Bookmark className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              {t.saved.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">{t.saved.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search saved..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            <button 
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 h-[38px]"
            >
              <RefreshCw size={16} className={`${syncing ? 'animate-spin' : ''} text-blue-600`} />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Sync</span>
            </button>

            <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <Calendar size={14} className="text-slate-400 ml-2" />
              <input 
                type="date" 
                className="text-xs bg-transparent outline-none dark:text-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span className="text-slate-300">-</span>
              <input 
                type="date" 
                className="text-xs bg-transparent outline-none dark:text-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex gap-8 mb-8 border-b border-slate-200 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('items')}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'items' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Saved Items ({filteredItems.length})
          </button>
          <button 
            onClick={() => setActiveTab('searches')}
            className={`pb-4 px-2 text-sm font-bold transition-all border-b-2 ${activeTab === 'searches' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
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