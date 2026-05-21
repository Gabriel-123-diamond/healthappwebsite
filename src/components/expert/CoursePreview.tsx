'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface CoursePreviewProps {
  onSaveDraft: () => void;
}

export function CoursePreview({ onSaveDraft }: CoursePreviewProps) {
  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white dark:bg-slate-900 rounded-[48px] border-4 border-slate-100 dark:border-white/5 shadow-3xl overflow-hidden h-[800px] relative flex flex-col items-center justify-center p-12 text-center"
    >
      <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-8">
        <Eye className="w-10 h-10 text-blue-600" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Preview Unavailable</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium mb-10">
        Please save your course as a draft first to enable the live clinical preview node.
      </p>
      <button
        onClick={onSaveDraft}
        className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
      >
        Save Draft to Unlock Preview
      </button>
    </motion.div>
  );
}
