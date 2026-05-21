'use client';

import { motion } from 'framer-motion';
import { SourceItem } from './SourceItem';
import { ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';

interface SourceListProps {
  results: any[];
  filterFormat?: string;
  isLoggedOut?: boolean;
}

export const SourceList: React.FC<SourceListProps> = ({ results, filterFormat, isLoggedOut = false }) => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <h3 className={`text-xl font-black text-slate-900 dark:text-white tracking-tight ${isLoggedOut ? 'blur-[8px] select-none' : ''}`}>
            Evidence Documentation
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest text-slate-400 ${isLoggedOut ? 'blur-[4px] select-none' : ''}`}>
              Verified Source Records ({results.length})
            </span>
          </div>
        </div>
        
        {!isLoggedOut && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Integrity Verified</span>
          </div>
        )}
      </div>

      <div className="relative">
        <motion.div className="grid grid-cols-1 gap-4">
          {results.length > 0 ? (
            results.map((result, index) => (
              <SourceItem 
                key={result.id || index} 
                result={result} 
                index={index} 
                filterFormat={filterFormat} 
                isBlurred={isLoggedOut}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border-2 border-dashed border-slate-100 dark:border-slate-800">
              <p className="text-slate-400 font-bold">No {filterFormat === 'all' ? '' : filterFormat} documentation found for this query.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};