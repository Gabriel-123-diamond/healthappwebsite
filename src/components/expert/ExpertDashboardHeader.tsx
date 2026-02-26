'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { FileText, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const ExpertDashboardHeader: React.FC = () => {
  return (
    <header className="mb-10 flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Expert Dashboard</h1>
        <p className="text-slate-500">Manage your professional content and AI validations.</p>
      </div>
      <div className="flex gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href="/expert/articles/new" 
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-colors"
          >
            <FileText className="w-4 h-4" /> New Article
          </Link>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link 
            href="/expert/courses/new" 
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Plus className="w-4 h-4" /> Create Course
          </Link>
        </motion.div>
      </div>
    </header>
  );
};
