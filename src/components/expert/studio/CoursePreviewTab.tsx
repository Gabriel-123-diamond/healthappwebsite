'use client';

import React from 'react';
import { Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

interface CoursePreviewTabProps {
  courseId: string;
}

export const CoursePreviewTab: React.FC<CoursePreviewTabProps> = ({ courseId }) => {
  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white dark:bg-slate-900 rounded-[48px] border-4 border-slate-100 dark:border-white/5 shadow-3xl overflow-hidden h-[800px] relative"
    >
      <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/50 flex flex-col items-center justify-center p-12 text-center">
        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-8">
          <Eye className="w-10 h-10 text-blue-600" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Live Sandbox Mode</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium mb-10">
          Your course is currently rendering in the clinical sandbox. Changes made in the Curriculum tab will reflect here in real-time.
        </p>
        <Link 
          href={`/learning/${courseId}`} 
          target="_blank"
          className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
        >
          Open Full Preview in New Tab
        </Link>
      </div>
    </motion.div>
  );
};
