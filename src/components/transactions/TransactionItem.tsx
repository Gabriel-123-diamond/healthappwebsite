'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, Tag, ExternalLink } from 'lucide-react';
import { Transaction } from '@/services/paymentService';
import { useTranslations } from 'next-intl';

interface TransactionItemProps {
  tx: Transaction;
  index: number;
  formatPlanName: (tier: string) => string;
  onViewInvoice: (tx: Transaction) => void;
}

export function TransactionItem({ tx, index, formatPlanName, onViewInvoice }: TransactionItemProps) {
  const t = useTranslations('transactions');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      key={tx.id}
      className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all group shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6"
    >
      <div className="flex items-center gap-6 w-full sm:w-auto">
        <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500 shrink-0">
          <ShieldCheck size={28} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {formatPlanName(tx.metadata?.tier || tx.tier || 'Basic')}
            </h3>
            <span className={`text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${
              tx.status === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
            }`}>
              {tx.status}
            </span>
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar size={12} className="text-slate-300" />
              {new Date(tx.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-1.5">
              <Tag size={12} className="text-slate-300" />
              {t('ref')}: {tx.id.substring(0, 8).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-50 dark:border-white/5">
        <div className="text-right">
           <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1 hidden sm:block">{t('amountSettled')}</span>
           <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
             ₦{tx.amount.toLocaleString()}
           </div>
        </div>
        <button 
          onClick={() => onViewInvoice(tx)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white text-slate-600 dark:text-slate-400 rounded-xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 border border-slate-100 dark:border-white/5"
        >
          <ExternalLink size={12} /> {t('viewInvoice')}
        </button>
      </div>
    </motion.div>
  );
}
