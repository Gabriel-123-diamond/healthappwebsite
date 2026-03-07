'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ExpertDashboardHeaderProps {
  onCreationAttempt: (e: React.MouseEvent, type: 'article' | 'course') => void;
  verificationStatus?: string;
}

export const ExpertDashboardHeader: React.FC<ExpertDashboardHeaderProps> = ({ onCreationAttempt, verificationStatus }) => {
  const isVerified = verificationStatus === 'verified';

  return (
    <header className="mb-10 flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-3">Expert Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">Manage your professional content and AI-driven clinical validations.</p>
      </div>
      <div className="flex gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button 
            onClick={(e) => onCreationAttempt(e, 'article')}
            className={`px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${!isVerified ? 'grayscale opacity-80 cursor-not-allowed' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" /> New Article
          </button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <button 
            onClick={(e) => onCreationAttempt(e, 'course')}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-2xl ${!isVerified ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed grayscale' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] shadow-blue-500/10'}`}
          >
            <Plus className="w-4 h-4" /> Create Course
          </button>
        </motion.div>
      </div>
    </header>
  );
};
