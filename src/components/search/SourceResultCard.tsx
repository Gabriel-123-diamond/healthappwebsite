'use client';

import React from 'react';
import { ArrowRight, PlayCircle } from 'lucide-react';

interface SourceResultCardProps {
  result: any;
}

export const SourceResultCard: React.FC<SourceResultCardProps> = ({ result }) => {
  return (
    <a 
      href={result.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all shadow-sm block"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
              result.format === 'video' 
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}>
              {result.format}
            </span>
            <span className="text-xs text-slate-400 font-medium truncate">{result.source}</span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
            {result.title}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
            {result.summary}
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
        {result.format === 'video' && (
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
            <PlayCircle className="w-10 h-10 text-slate-400" />
          </div>
        )}
      </div>
    </a>
  );
};
