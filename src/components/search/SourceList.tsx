import React from 'react';
import { motion } from 'framer-motion';
import { SourceItem } from './SourceItem';

interface SourceListProps {
  results: any[];
  filterFormat?: string;
}

export const SourceList: React.FC<SourceListProps> = ({ results, filterFormat }) => {
  return (
    <div className="p-4 sm:p-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
        <h3 className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Trusted Sources ({results.length})</h3>
      </div>
      <motion.div className="grid gap-3 sm:gap-4">
        {results.length > 0 ? (
          results.map((result, index) => (
            <SourceItem key={result.id || index} result={result} index={index} filterFormat={filterFormat} />
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm font-bold">
            No {filterFormat === 'all' ? '' : filterFormat} sources found.
          </div>
        )}
      </motion.div>
    </div>
  );
};