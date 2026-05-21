'use client';

import React from 'react';
import { Layout, ListTree, Eye, Loader2, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type StudioTab = 'overview' | 'curriculum' | 'preview';

interface CourseStudioHeaderProps {
  activeTab: StudioTab;
  setActiveTab: (tab: StudioTab) => void;
  saveSuccess: boolean;
  loading: boolean;
  handleUpdate: (status: 'draft' | 'published') => void;
}

export const CourseStudioHeader: React.FC<CourseStudioHeaderProps> = ({
  activeTab,
  setActiveTab,
  saveSuccess,
  loading,
  handleUpdate,
}) => {
  const tabItems = [
    { id: 'overview', label: 'Course Overview', icon: Layout },
    { id: 'curriculum', label: 'Curriculum Builder', icon: ListTree },
    { id: 'preview', label: 'Live Preview', icon: Eye },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl">
      <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as StudioTab)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-lg' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
          >
            <tab.icon size={14} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <AnimatePresence>
          {saveSuccess && (
            <motion.span 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-4"
            >
              ✓ Changes Synced
            </motion.span>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => handleUpdate('draft')}
          disabled={loading}
          className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleUpdate('published')}
          disabled={loading}
          className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          Publish Course
        </button>
      </div>
    </div>
  );
};
