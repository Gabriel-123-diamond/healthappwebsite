'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Leaf, Sparkles, FileText, Video, LayoutGrid } from 'lucide-react';

interface SearchFiltersProps {
  hasResults: boolean;
  searchMode: string;
  setSearchMode: (mode: 'medical' | 'herbal' | 'both') => void;
  executedMode: string;
  displayMode: string;
  setDisplayMode: (mode: 'medical' | 'herbal' | 'both') => void;
  filterFormat: string;
  setFilterFormat: (format: 'all' | 'article' | 'video') => void;
  t: any;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  hasResults,
  searchMode,
  setSearchMode,
  executedMode,
  displayMode,
  setDisplayMode,
  filterFormat,
  setFilterFormat,
  t
}) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Search Mode Selection */}
      <div className="flex flex-wrap justify-center gap-3">
        {(!hasResults || executedMode === 'medical' || executedMode === 'both') && (
          <FilterButton
            icon={<Stethoscope className="w-4 h-4" />}
            label={t('search.medical')}
            isActive={hasResults ? displayMode === 'medical' : searchMode === 'medical'}
            onClick={() => hasResults ? setDisplayMode('medical') : setSearchMode('medical')}
            colorClass="blue"
          />
        )}
        
        {(!hasResults || executedMode === 'herbal' || executedMode === 'both') && (
          <FilterButton
            icon={<Leaf className="w-4 h-4" />}
            label={t('search.herbal')}
            isActive={hasResults ? displayMode === 'herbal' : searchMode === 'herbal'}
            onClick={() => hasResults ? setDisplayMode('herbal') : setSearchMode('herbal')}
            colorClass="emerald"
          />
        )}
        
        {(!hasResults || executedMode === 'both') && (
          <FilterButton
            icon={<Sparkles className="w-4 h-4" />}
            label={t('search.both')}
            isActive={hasResults ? displayMode === 'both' : searchMode === 'both'}
            onClick={() => hasResults ? setDisplayMode('both') : setSearchMode('both')}
            colorClass="purple"
          />
        )}
      </div>

      {/* Content Format Filters (Only show when results exist) */}
      {hasResults && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50"
        >
          <FormatChip 
            icon={<LayoutGrid className="w-3.5 h-3.5" />}
            label="All Formats"
            isActive={filterFormat === 'all'}
            onClick={() => setFilterFormat('all')}
          />
          <FormatChip 
            icon={<FileText className="w-3.5 h-3.5" />}
            label="Articles"
            isActive={filterFormat === 'article'}
            onClick={() => setFilterFormat('article')}
          />
          <FormatChip 
            icon={<Video className="w-3.5 h-3.5" />}
            label="Videos"
            isActive={filterFormat === 'video'}
            onClick={() => setFilterFormat('video')}
          />
        </motion.div>
      )}
    </div>
  );
};

function FilterButton({ icon, label, isActive, onClick, colorClass }: any) {
  const colors: Record<string, string> = {
    blue: isActive ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600',
    emerald: isActive ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600',
    purple: isActive ? 'bg-purple-600 text-white border-purple-600' : 'text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl border transition-all duration-300 ${
        isActive 
          ? `shadow-lg shadow-${colorClass}-500/20 transform scale-[1.02]` 
          : 'border-transparent bg-slate-50 dark:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-700'
      } ${colors[colorClass]}`}
    >
      {icon}
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function FormatChip({ icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
        isActive
          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
          : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default SearchFilters;
