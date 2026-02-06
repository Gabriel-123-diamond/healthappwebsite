'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Leaf, Sparkles } from 'lucide-react';
import { FilterButton } from './FilterButton';

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
  const isModeActive = (mode: string) => hasResults ? displayMode === mode : searchMode === mode;
  const toggleMode = (mode: any) => hasResults ? setDisplayMode(mode) : setSearchMode(mode);

  return (
    <motion.div 
      layout
      className={`flex flex-col md:flex-row gap-4 mb-6 ${hasResults ? 'items-start md:items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4' : 'items-center justify-center'}`}
    >
      {/* Search Modes */}
      <div className={`flex flex-wrap gap-2 ${hasResults ? 'justify-start' : 'justify-center'}`}>
        {(!hasResults || executedMode === 'medical' || executedMode === 'both') && (
          <SearchModeButton 
            active={isModeActive('medical')} 
            onClick={() => toggleMode('medical')} 
            label={t('common.medical')} 
            icon={<Stethoscope className="w-4 h-4" />}
            colorClass="bg-blue-600"
            compact={hasResults}
          />
        )}
        {(!hasResults || executedMode === 'herbal' || executedMode === 'both') && (
          <SearchModeButton 
            active={isModeActive('herbal')} 
            onClick={() => toggleMode('herbal')} 
            label={t('common.herbal')} 
            icon={<Leaf className="w-4 h-4" />}
            colorClass="bg-emerald-600"
            compact={hasResults}
          />
        )}
        {(!hasResults || executedMode === 'both') && (
          <SearchModeButton 
            active={isModeActive('both')} 
            onClick={() => toggleMode('both')} 
            label={t('common.both')} 
            icon={<Sparkles className="w-4 h-4" />}
            colorClass="bg-slate-800"
            compact={hasResults}
          />
        )}
      </div>

      {/* Content Type Filters */}
      <div className={`flex gap-2 ${hasResults ? 'justify-start' : 'justify-center'}`}>
        <FilterButton 
          label="All Results" 
          isActive={filterFormat === 'all'} 
          onClick={() => setFilterFormat('all')} 
          activeClass="bg-slate-900 text-white dark:bg-white dark:text-slate-900"
        />
        <FilterButton 
          label="Articles" 
          isActive={filterFormat === 'article'} 
          onClick={() => setFilterFormat('article')} 
          activeClass="bg-blue-600 text-white"
        />
        <FilterButton 
          label="Videos" 
          isActive={filterFormat === 'video'} 
          onClick={() => setFilterFormat('video')} 
          activeClass="bg-red-600 text-white"
        />
      </div>
    </motion.div>
  );
}

function SearchModeButton({ active, onClick, label, icon, colorClass, compact }: any) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex items-center gap-2 rounded-xl font-bold transition-all border ${
        active
          ? `${colorClass} text-white border-transparent shadow-md`
          : `bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300`
      } ${compact ? 'px-3 py-1.5 text-xs' : 'px-6 py-3'}`}
    >
      {icon}
      {label}
    </motion.button>
  );
}