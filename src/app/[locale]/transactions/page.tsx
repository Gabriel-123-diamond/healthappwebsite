'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CreditCard, ChevronLeft, Receipt, Loader2 } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentService, Transaction } from '@/services/paymentService';
import ScrollToTop from '@/components/common/ScrollToTop';
import { InvoiceModal } from '@/components/transactions/InvoiceModal';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';
import { TransactionItem } from '@/components/transactions/TransactionItem';

export default function TransactionsPage() {
  const commonT = useTranslations('common');
  const t = useTranslations('transactions');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'year'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await paymentService.getUserTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (dateFilter !== 'all') {
        const txDate = new Date(tx.timestamp);
        const now = new Date();
        const diffDays = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
        if (dateFilter === 'today' && diffDays > 1) return false;
        if (dateFilter === 'week' && diffDays > 7) return false;
        if (dateFilter === 'month' && diffDays > 30) return false;
        if (dateFilter === 'year' && diffDays > 365) return false;
      }
      return true;
    });
  }, [transactions, statusFilter, dateFilter]);

  const formatPlanName = (tier: string) => {
    const lowerTier = tier?.toLowerCase() || 'basic';
    if (['vip1', 'plus', 'professional'].includes(lowerTier)) return 'IKIKÉ PROFESSIONAL';
    if (['vip2', 'premium', 'elite'].includes(lowerTier)) return 'IKIKÉ PREMIUM';
    return `IKIKÉ ${tier.toUpperCase()}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden font-inter">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          {commonT('back')}
        </motion.button>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-[10px] bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50 mb-4">
              <Receipt size={12} /> {t('ledger')}
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{t('title')}</h1>
            <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
              {t('subtitle')}
            </p>
          </div>

          <TransactionFilters 
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />
        </header>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-40 gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('syncing')}</span>
            </motion.div>
          ) : filteredTransactions.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 rounded-[40px] p-12 sm:p-20 text-center border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-slate-300">
                <CreditCard size={40} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">{t('noHistory')}</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-md mx-auto font-medium">{t('noHistoryDesc')}</p>
              <Link href="/upgrade" className="px-10 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/20 active:scale-95">
                {t('explorePlans')}
              </Link>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {filteredTransactions.map((tx, index) => (
                <TransactionItem 
                  key={tx.id} 
                  tx={tx} 
                  index={index} 
                  formatPlanName={formatPlanName} 
                  onViewInvoice={setSelectedInvoice} 
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedInvoice && (
          <InvoiceModal 
            transaction={selectedInvoice} 
            onClose={() => setSelectedInvoice(null)} 
            formatPlanName={formatPlanName}
          />
        )}
      </AnimatePresence>

      <ScrollToTop />
    </div>
  );
}
