'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import { SearchHistoryItem } from '@/types/history';

interface HistoryItemCardProps {
  item: SearchHistoryItem;
  variants: Variants;
  router: any;
}

export function HistoryItemCard({ item, variants, router }: HistoryItemCardProps) {
  return (
    <motion.div 
      variants={variants}
      className="bg-white dark:bg-[#0B1221] p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 relative z-10">
        <div className="space-y-1">
          <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 transition-colors capitalize leading-none">
            {item.query}
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {item.timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} • {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-[0.2em] border shadow-sm ${
            item.mode === 'medical' ? 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' :
            item.mode === 'herbal' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' : 
            'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800'
          }`}>
            {item.mode} PROTOCOL
          </span>
          <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-slate-300">
            <Sparkles size={14} />
          </div>
        </div>
      </div>

      {item.summary && (
        <p className="text-slate-600 dark:text-slate-300 text-base line-clamp-2 leading-relaxed font-medium mb-8 relative z-10">{item.summary}</p>
      )}

      <div className="flex justify-end pt-6 border-t border-slate-50 dark:border-white/5 relative z-10">
        <button 
          onClick={() => router.push(`/search?q=${encodeURIComponent(item.query)}&mode=${item.mode}`)}
          className="group/btn flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
        >
          <Search size={14} className="group-hover/btn:scale-110 transition-transform" />
          Restore Synthesis
        </button>
      </div>
    </motion.div>
  );
}
