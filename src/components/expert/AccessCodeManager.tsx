'use client';

import React, { useState } from 'react';
import { Layers, ChevronRight, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { AccessCode } from '@/services/expertDashboardService';
import { AccessCodeListModal } from './AccessCodeListModal';

interface AccessCodeManagerProps {
  codes: AccessCode[];
  loading: boolean;
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
}

export function AccessCodeManager({ codes, loading, onDelete, onCopy }: AccessCodeManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Nodes...</p>
      </div>
    );
  }

  const activeCount = codes.filter(c => {
    const isExpired = new Date(c.expiresAt) < new Date();
    const isLimitReached = c.usageLimit > 0 && c.usageCount >= c.usageLimit;
    return !isExpired && !isLimitReached;
  }).length;

  if (codes.length === 0) {
    return (
      <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
        <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <AlertCircle className="w-6 h-6 text-slate-300" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">No active access codes found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Trigger Card */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setIsModalOpen(true)}
        className="w-full p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-[32px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-between group shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white dark:bg-slate-900 text-indigo-600 rounded-2xl shadow-sm transition-colors group-hover:bg-indigo-600 group-hover:text-white">
            <Layers size={20} />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5 text-slate-400">
              Operational Nodes
            </p>
            <h4 className="text-lg font-black tracking-tight leading-none text-slate-900 dark:text-white">
              {activeCount} Active Protocol{activeCount !== 1 ? 's' : ''}
            </h4>
          </div>
        </div>
        <div className="p-2 bg-slate-200/50 dark:bg-white/5 rounded-full text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all">
          <ChevronRight size={18} />
        </div>
      </motion.button>

      <AccessCodeListModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        codes={codes}
        onDelete={onDelete}
        onCopy={onCopy}
      />
    </div>
  );
}
