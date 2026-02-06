'use client';

import React from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafetyCheckResult } from '@/services/safetyClientService';

interface SearchInputProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
  hasResults: boolean;
  safetyResult: SafetyCheckResult | null;
  placeholder: string;
  searchLabel: string;
}

export default function SearchInput({
  query,
  setQuery,
  onSearch,
  isSearching,
  hasResults,
  safetyResult,
  placeholder,
  searchLabel
}: SearchInputProps) {
  return (
    <div className={`transition-all duration-500 ${hasResults ? 'mb-4 mt-4' : 'mb-8 text-center'}`}>
      <form onSubmit={onSearch} className={`relative max-w-3xl ${hasResults ? '' : 'mx-auto'}`}>
        <motion.div 
          className="relative group"
          layout
          transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-12 sm:pl-14 pr-24 sm:pr-32 rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-xl ${hasResults ? 'py-2.5 sm:py-3 text-sm sm:text-base' : 'py-4 sm:py-5 text-base sm:text-lg'}`}
          />
          <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <motion.button
            type="submit"
            disabled={isSearching || !!safetyResult?.hasRedFlag}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white rounded-lg sm:rounded-xl font-black hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2 ${
              (isSearching || !!safetyResult?.hasRedFlag) ? 'opacity-50 cursor-not-allowed' : ''
            } ${hasResults ? 'px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm' : 'px-4 sm:px-6 py-2.5 sm:py-3'}`}
          >
            {isSearching ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" /> : (
              <>
                <span className="hidden sm:inline">{searchLabel}</span>
                <span className="sm:hidden">Go</span>
              </>
            )}
          </motion.button>
        </motion.div>
        
        <AnimatePresence>
          {safetyResult?.hasRedFlag && (
            <motion.div
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 text-left overflow-hidden"
            >
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-800 dark:text-red-400 flex items-center gap-2">
                  {safetyResult.redFlagType || 'Emergency Warning'}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {safetyResult.message} <strong>{safetyResult.action}</strong>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
