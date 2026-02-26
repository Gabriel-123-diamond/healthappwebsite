'use client';

import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { AIResponse } from '@/types';

interface SearchResultActionsProps {
  query?: string;
  mode?: string;
  response: AIResponse;
}

export const SearchResultActions: React.FC<SearchResultActionsProps> = ({ query, mode, response }) => {
  if (!query) return null;

  return (
    <div className="p-8 sm:p-12 pt-0 bg-white dark:bg-slate-900 flex flex-col items-center">
      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-100 dark:via-slate-800 to-transparent mb-10" />
      
      <div className="text-center space-y-6 max-w-sm">
        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto text-blue-600 dark:text-blue-400">
          <Search size={20} />
        </div>
        
        <div className="space-y-2">
          <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Expand Your Discovery</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Access deeper analytics, related research papers, and extended community discussions for "{query}".
          </p>
        </div>

        <Link
          href={`/search?q=${encodeURIComponent(query)}&mode=${mode}`}
          onClick={() => {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(`search_cache_${query}_${mode}`, JSON.stringify(response));
            }
          }}
          className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[20px] font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-900/20 group"
        >
          Explore Deep Intelligence
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
