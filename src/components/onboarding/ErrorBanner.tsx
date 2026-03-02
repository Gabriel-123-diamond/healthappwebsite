'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
  errors: string[];
  title?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({ 
  errors, 
  title = "Attention Required" 
}) => {
  return (
    <AnimatePresence>
      {errors.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: 10, height: 0 }}
          className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-3xl p-6 flex items-start gap-4 shadow-sm"
        >
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
            <AlertCircle size={20} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black text-red-700 dark:text-red-400 uppercase tracking-widest mb-2">
              {title}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
              {errors.map((err, i) => (
                <li key={i} className="text-sm text-red-600 dark:text-red-400/80 font-medium flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-red-400 shrink-0" /> {err}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
