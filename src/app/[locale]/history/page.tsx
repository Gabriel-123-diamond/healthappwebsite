'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getSearchHistory, clearSearchHistory } from '@/services/historyService';
import { SearchHistoryItem } from '@/types/history';
import { History, Calendar, Loader2, Trash2, ChevronLeft, Search, Sparkles } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { useLanguage } from '@/context/LanguageContext';
import DateRangePicker from '@/components/common/DateRangePicker';
import NiceModal from '@/components/common/NiceModal';
import { motion, AnimatePresence } from 'framer-motion';
import { HistoryItemCard } from '@/components/history/HistoryItemCard';
import { HistoryHeader } from '@/components/history/HistoryHeader';

export default function HistoryPage() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

  const router = useRouter();
  const { t } = useLanguage();

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

  const fetchHistory = React.useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const start = startDate ? new Date(startDate) : undefined;
      const end = endDate ? new Date(endDate) : undefined;
      if (end) end.setHours(23, 59, 59, 999);

      const data = await getSearchHistory(userId, start, end);
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHistory(user.uid);
      } else {
        router.push('/auth/signin');
      }
    });
    return () => unsubscribe();
  }, [fetchHistory, router]);

  const handleClearHistory = async () => {
    const confirmMsg = t.history.clearConfirm || "Are you sure you want to permanently clear your entire search history from the encrypted database?";
    
    showConfirm(
      "Confirm Wipe",
      confirmMsg,
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setClearing(true);
        try {
          await clearSearchHistory();
          setHistory([]);
          showAlert('History Cleared', 'Your entire search history has been wiped from the secure nodes.', 'success');
        } catch (e) {
          showAlert('Action Failed', 'We could not clear your history. Please try again.', 'warning');
        } finally {
          setClearing(false);
        }
      }
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 transition-colors relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/5 blur-[100px] rounded-full -z-10" />

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

        <HistoryHeader 
          title={t.history.title}
          subtitle={t.history.subtitle}
          clearing={clearing}
          historyLength={history.length}
          handleClearHistory={handleClearHistory}
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-6" />
                <div className="absolute inset-0 blur-xl bg-blue-600/20 animate-pulse" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Querying History Node...</p>
            </motion.div>
          ) : history.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10 shadow-inner"
            >
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Search size={32} className="text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">{t.history.noHistory}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">{t.history.noHistoryDesc}</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {history.map((item) => (
                <HistoryItemCard 
                  key={item.id}
                  item={item}
                  variants={itemVariants}
                  router={router}
                />
              ))}
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
