'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AIResponse } from '@/services/aiService';

interface SearchResultActionsProps {
  query?: string;
  mode?: string;
  response: AIResponse;
}

export const SearchResultActions: React.FC<SearchResultActionsProps> = ({ query, mode, response }) => {
  if (!query) return null;

  return (
    <div className="p-5 sm:p-8 pt-0 bg-slate-50 dark:bg-slate-900/50 flex justify-center">
      <Link
        href={`/search?q=${encodeURIComponent(query)}&mode=${mode}`}
        onClick={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem(`search_cache_${query}_${mode}`, JSON.stringify(response));
          }
        }}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-sm font-black text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-200 transition-all shadow-sm active:scale-95 group"
      >
        View More Results
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-500" />
      </Link>
    </div>
  );
};
