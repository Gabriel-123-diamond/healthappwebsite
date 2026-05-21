'use client';

import React from 'react';
import { X } from 'lucide-react';

interface DirectoryResultsInfoProps {
  filteredCount: number;
  activeFiltersCount: number;
  searchQuery: string;
  onClearAll: () => void;
  t: any;
}

export function DirectoryResultsInfo({
  filteredCount,
  activeFiltersCount,
  searchQuery,
  onClearAll,
  t
}: DirectoryResultsInfoProps) {
  return (
    <div className="mb-8 flex justify-between items-center px-2">
      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
        {t('showing')} <span className="text-slate-900 dark:text-white">{filteredCount}</span> {t('professionals')}
      </p>
      {(activeFiltersCount > 0 || searchQuery !== '') && (
        <button 
          onClick={onClearAll}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
        >
          <X className="w-3 h-3" /> {t('clearAll')}
        </button>
      )}
    </div>
  );
}
