'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Leaf, Sparkles } from 'lucide-react';

interface SearchFiltersProps {
  hasResults: boolean;
  searchMode: 'medical' | 'herbal' | 'both';
  setSearchMode: (mode: 'medical' | 'herbal' | 'both') => void;
  executedMode: 'medical' | 'herbal' | 'both';
  displayMode: 'medical' | 'herbal' | 'both';
  setDisplayMode: (mode: 'medical' | 'herbal' | 'both') => void;
  filterFormat: 'all' | 'article' | 'video';
  setFilterFormat: (format: 'all' | 'article' | 'video') => void;
  t: any;
}

export default function SearchFilters({
  hasResults,
  searchMode,
  setSearchMode,
  executedMode,
  displayMode,
  setDisplayMode,
  filterFormat,
  setFilterFormat,
  t
}: SearchFiltersProps) {
  return (
    <motion.div 
      layout
      className={`flex flex-col md:flex-row gap-4 mb-6 ${hasResults ? 'items-start md:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4' : 'items-center justify-center flex-col'}`}
    >
      {/* Search Modes */}
      <div className={`flex flex-wrap gap-2 ${hasResults ? 'justify-start' : 'justify-center'}`}>
        {(!hasResults || executedMode === 'medical' || executedMode === 'both') && (
          <SearchModeButton 
            active={hasResults ? displayMode === 'medical' : searchMode === 'medical'} 
            onClick={() => hasResults ? setDisplayMode('medical') : setSearchMode('medical')} 
            label={t('common.medical')} 
            icon={<Stethoscope className="w-4 h-4" />}
            colorClass="bg-blue-600"
            hoverClass="hover:border-blue-300"
            compact={hasResults}
          />
        )}
        {(!hasResults || executedMode === 'herbal' || executedMode === 'both') && (
          <SearchModeButton 
            active={hasResults ? displayMode === 'herbal' : searchMode === 'herbal'} 
            onClick={() => hasResults ? setDisplayMode('herbal') : setSearchMode('herbal')} 
            label={t('common.herbal')} 
            icon={<Leaf className="w-4 h-4" />}
            colorClass="bg-emerald-600"
            hoverClass="hover:border-emerald-300"
            compact={hasResults}
          />
        )}
        {(!hasResults || executedMode === 'both') && (
          <SearchModeButton 
            active={hasResults ? displayMode === 'both' : searchMode === 'both'} 
            onClick={() => hasResults ? setDisplayMode('both') : setSearchMode('both')} 
            label={t('common.both')} 
            icon={<Sparkles className="w-4 h-4" />}
            colorClass="bg-slate-800"
            hoverClass="hover:border-slate-400"
            compact={hasResults}
          />
        )}
      </div>

      {/* Content Filters */}
      <div className={`flex gap-2 ${hasResults ? 'justify-start' : 'justify-center'}`}>
        <button
          onClick={() => setFilterFormat('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'all' ? 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
        >
          All Results
        </button>
        <button
          onClick={() => setFilterFormat('article')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'article' ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50'}`}
        >
          Articles
        </button>
        <button
          onClick={() => setFilterFormat('video')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filterFormat === 'video' ? 'bg-red-600 text-white' : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50'}`}
        >
          Videos
        </button>
      </div>
    </motion.div>
  );
}

function SearchModeButton({ active, onClick, label, icon, colorClass, hoverClass, compact }: any) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      layout
      className={`flex items-center gap-2 rounded-xl font-medium transition-colors ${
        active
          ? `${colorClass} text-white shadow-lg`
          : `bg-white text-slate-600 border border-slate-200 ${hoverClass}`
      } ${compact ? 'px-3 py-2 text-sm' : 'px-6 py-3'}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}
