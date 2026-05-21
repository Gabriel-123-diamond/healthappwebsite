'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Calendar, RefreshCw, Search, Loader2, Trash2, ChevronLeft, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSavedContent } from '@/hooks/useSavedContent';
import { EmptyState } from '@/components/common/EmptyState';
import { SavedItemCard, SavedSearchCard } from '@/components/profile/SavedCards';
import DateRangePicker from '@/components/common/DateRangePicker';
import { useRouter } from '@/i18n/routing';
import NiceModal from '@/components/common/NiceModal';
import { SavedPageHeader } from '@/components/saved/SavedPageHeader';
import { SavedControls } from '@/components/saved/SavedControls';

export default function SavedPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isClearing, setIsClearing] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm
    });
  };

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
      ? "This will permanently delete all saved articles and videos from your secure vault. Continue?"
      : "This will permanently delete all saved AI responses and clinical summaries. Continue?";
    
    showConfirm(
      "Confirm Wipe",
      confirmMsg,
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setIsClearing(true);
        try {
          if (activeTab === 'items') await clearAllItems();
          else await clearAllSearches();
          showAlert('Content Cleared', 'All saved items in this category have been removed.', 'success');
        } catch (e) {
          showAlert('Action Failed', 'We could not clear the content. Please try again.', 'warning');
        } finally {
          setIsClearing(false);
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Accessing Vault...</p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-32 sm:pt-40 pb-24 px-4 transition-colors relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-10 bg-white dark:bg-[#0B1221] px-4 py-2 rounded-xl border border-slate-200 dark:border-white/5 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </motion.button>

        <SavedPageHeader 
          t={t}
          handleClearAll={handleClearAll}
          isClearing={isClearing}
          activeTab={activeTab}
          filteredItemsLength={filteredItems.length}
          filteredSearchesLength={filteredSearches.length}
          handleSync={handleSync}
          syncing={syncing}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <SavedControls 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          filteredItemsLength={filteredItems.length}
          filteredSearchesLength={filteredSearches.length}
        />

        <AnimatePresence mode="wait">
          {activeTab === 'items' ? (
            <motion.div 
              key="items-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filteredItems.length === 0 ? (
                <EmptyState text={searchQuery ? 'No records matching query' : t.saved.noSaved} icon={<Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-700" />} desc={searchQuery ? 'Try a different search term.' : t.saved.noSavedDesc} />
              ) : (
                <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredItems.map((item) => (
                      <motion.div key={item.id} variants={itemVariants} layout>
                        <SavedItemCard item={item} onDelete={deleteItem} t={t} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="searches-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {filteredSearches.length === 0 ? (
                <EmptyState text={searchQuery ? 'No records matching query' : "No saved syntheses"} icon={<Search className="w-10 h-10 text-slate-300 dark:text-slate-700" />} desc={searchQuery ? 'Try a different search term.' : "Save entire AI responses to see them here."} />
              ) : (
                <motion.div layout variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredSearches.map((search) => (
                      <motion.div key={search.id} variants={itemVariants} layout>
                        <SavedSearchCard search={search} onDelete={() => deleteSearch(search.id)} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText="Got it"
      />

      <NiceModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Confirm Action"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
