'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Database, Loader2, Download } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface DataVaultNodeProps {
  processingExport: boolean;
  handleExport: () => void;
}

export function DataVaultNode({ processingExport, handleExport }: DataVaultNodeProps) {
  const t = useTranslations('profile.stats');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onClick={() => !processingExport && handleExport()}
      className="bg-slate-900 dark:bg-[#0B1221] rounded-[40px] p-8 sm:p-12 border border-slate-800 dark:border-white/5 shadow-2xl relative overflow-hidden group cursor-pointer md:col-span-2 xl:col-span-3"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative z-10">
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="p-6 bg-white/10 rounded-[32px] text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 backdrop-blur-md border border-white/10 shadow-2xl">
              {processingExport ? <Loader2 size={40} className="animate-spin"/> : <Database size={40} />}
            </div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500 rounded-full border-4 border-slate-900 animate-pulse" />
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">{t('dataVault')}</h3>
              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest border border-emerald-500/30">
                  Cloud Records
                </span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.25em]">
                  DOWNLOAD RECORDS
                </p>
                </div>
                </div>

                <div className="flex items-center gap-6">
                <div className="flex-1 max-w-[200px] h-1.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full w-3/4 bg-emerald-500/50 rounded-full" />
                </div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Storage Status</span>
                </div>
                </div>
                </div>

                <div className="flex items-center gap-8 self-end lg:self-auto">
                <div className="hidden xl:block h-16 w-px bg-white/10" />
                <div className="flex flex-col items-end gap-2">
                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform flex items-center gap-6">
                <span>Download My Records</span>
                <div className="p-4 bg-emerald-500 text-slate-900 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                <Download size={20} strokeWidth={3} />
                </div>
                </div>
                <div className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.2em] mr-16">
                Last synced: {new Date().toLocaleDateString()}
                </div>
                </div>
                </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 opacity-20 overflow-hidden">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
        />
      </div>
    </motion.div>
  );
}
