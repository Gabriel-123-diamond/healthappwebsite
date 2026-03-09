'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DirectoryPaginationProps {
  currentPage: number;
  setCurrentPage: (page: number | ((p: number) => number)) => void;
  totalPages: number;
  customPageInput: string;
  setCustomPageInput: (input: string) => void;
}

export function DirectoryPagination({
  currentPage,
  setCurrentPage,
  totalPages,
  customPageInput,
  setCustomPageInput
}: DirectoryPaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageButtons = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages.map((p, i) => (
      p === '...' ? (
        <span key={`ellipsis-${i}`} className="w-10 text-center text-slate-400 font-black">...</span>
      ) : (
        <button
          key={`page-${p}`}
          onClick={() => {
            setCurrentPage(Number(p));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${
            currentPage === p
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
              : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:bg-slate-50 hover:border-blue-500/50'
          }`}
        >
          {p}
        </button>
      )
    ));
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8">
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setCurrentPage(p => Math.max(1, p - 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === 1}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-2">
          {renderPageButtons()}
        </div>

        <button
          onClick={() => {
            setCurrentPage(p => Math.min(totalPages, p + 1));
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          disabled={currentPage === totalPages}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 pl-6 border-l border-slate-200 dark:border-slate-800">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap">Jump to</span>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const val = parseInt(customPageInput);
            if (val >= 1 && val <= totalPages) {
              setCurrentPage(val);
              setCustomPageInput('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="relative"
        >
          <input
            type="number"
            min="1"
            max={totalPages}
            value={customPageInput}
            onChange={(e) => setCustomPageInput(e.target.value)}
            placeholder={currentPage.toString()}
            className="w-16 px-3 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center font-black text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm placeholder:text-slate-300"
          />
        </form>
      </div>
    </div>
  );
}
