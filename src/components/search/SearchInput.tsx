'use client';

import React from 'react';
import { Search, Loader2, ArrowRight, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SafetyCheckResult } from '@/hooks/useSearchSafety';

interface SearchInputProps {
  query: string;
  setQuery: (val: string) => void;
  onSearch: (e: React.FormEvent) => void;
  isSearching: boolean;
  hasResults: boolean;
  safetyResult?: SafetyCheckResult | null;
  placeholder: string;
  searchLabel: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  query,
  setQuery,
  onSearch,
  isSearching,
  hasResults,
  safetyResult,
  placeholder,
  searchLabel
}) => {
  return (
    <div className="w-full relative z-30">
      <form onSubmit={onSearch} className="relative group">
        <div className={`relative flex items-center bg-white dark:bg-slate-900 rounded-[32px] border transition-all duration-500 ease-[0.22,1,0.36,1] ${
          hasResults 
            ? 'shadow-sm border-slate-200 dark:border-slate-800' 
            : 'shadow-[0_20px_70px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_70px_-15px_rgba(0,0,0,0.3)] border-slate-100 dark:border-slate-800/50 p-2 group-focus-within:border-blue-500/50 group-focus-within:ring-8 group-focus-within:ring-blue-500/5'
        }`}>
          
          <div className="pl-6 text-slate-400">
            <Search className={`w-6 h-6 transition-all duration-500 ${isSearching ? 'text-blue-500 animate-pulse scale-110' : 'group-focus-within:text-blue-600 group-focus-within:scale-110'}`} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full py-5 px-5 bg-transparent border-none focus:ring-0 text-xl font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 outline-none transition-all"
            disabled={isSearching}
          />

          <div className="pr-2">
            <button
              type="submit"
              disabled={isSearching || !query.trim() || safetyResult?.hasRedFlag}
              className={`relative overflow-hidden flex items-center gap-3 px-8 py-4 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all duration-500 ${
                isSearching || !query.trim() || safetyResult?.hasRedFlag
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl hover:scale-[1.02] active:scale-95'
              }`}
            >
              <span className="relative z-10 flex items-center gap-3">
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="hidden sm:inline">{searchLabel}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              {!isSearching && query.trim() && !safetyResult?.hasRedFlag && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 hover:opacity-100 transition-opacity duration-500" />
              )}
            </button>
          </div>
        </div>

        {/* Safety Warning Overlay */}
        <AnimatePresence>
          {safetyResult && safetyResult.hasRedFlag && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-4 left-0 w-full p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl shadow-xl flex items-start gap-4 z-20"
            >
              <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-red-700 dark:text-red-400 uppercase tracking-widest mb-1">
                  {safetyResult.redFlagType || 'Safety Alert'}
                </h4>
                <p className="text-sm text-red-600 dark:text-red-300 font-medium leading-relaxed">
                  {safetyResult.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};

export default SearchInput;
