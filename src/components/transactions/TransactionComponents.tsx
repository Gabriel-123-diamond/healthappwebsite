import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, CheckCircle2, AlertCircle, Clock, ArrowRight, Zap, Crown, User } from 'lucide-react';
import { ReceiptModal } from './ReceiptModal';

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  timestamp: string;
  status: string;
  metadata: any;
}

export const formatPlanName = (tier: string) => {
  if (!tier) return null;
  const t = tier.toLowerCase();
  if (t === 'vip1' || t === 'plus') return 'IKIKE PLUS';
  if (t === 'vip2' || t === 'premium' || t === 'elite') return 'IKIKE ELITE';
  return tier.toUpperCase();
};

export const TransactionHeader = () => (
  <div className="mb-12 text-center space-y-4">
    <div className="mx-auto w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-blue-600/20 mb-6">
      <CreditCard size={32} />
    </div>
    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
      Billing <span className="text-blue-600">History.</span>
    </h1>
    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
      Access your full clinical acquisition records and protocol subscriptions.
    </p>
  </div>
);

export const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const isSuccess = transaction.status === 'success';
  
  const planTier = transaction.metadata?.tier || (transaction as any).tier;
  const planName = planTier ? formatPlanName(planTier) : null;

  const getTypeDisplay = () => {
    switch(transaction.type) {
      case 'upgrade': return { label: planName || 'Node Scale', icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' };
      case 'expert_upgrade': return { label: planName || 'Clinical Registry', icon: Crown, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' };
      case 'appointment': return { label: 'Expert Consultation', icon: User, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
      default: return { label: planName || 'Clinical Acquisition', icon: CreditCard, color: 'text-slate-600', bg: 'bg-slate-50 dark:bg-white/5' };
    }
  };

  const type = getTypeDisplay();
  const date = new Date(transaction.timestamp).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowReceipt(true)}
        className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-blue-500/20 cursor-pointer transition-all group"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 ${type.bg} rounded-2xl flex items-center justify-center ${type.color}`}>
              <type.icon size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm flex items-center gap-2">
                {type.label}
                {isSuccess ? (
                  <CheckCircle2 size={14} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={14} className="text-amber-500" />
                )}
              </h3>
              <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                <span className="flex items-center gap-1"><Clock size={10} /> {date}</span>
                <span className="w-1 h-1 rounded-full bg-slate-200 dark:bg-white/10" />
                <span>Ref: {transaction.id.slice(0, 12)}...</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-8 pl-1 sm:pl-0">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Amount</p>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                ₦{transaction.amount.toLocaleString()}
              </p>
            </div>
            <div className="px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 group-hover:border-blue-500/20 transition-colors">
              <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        </div>
        
        {(transaction.metadata || (transaction as any).tier) && (
          <div className="mt-6 pt-6 border-t border-slate-50 dark:border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {planTier && (
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Target Protocol</p>
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">{planName || planTier}</p>
              </div>
            )}
            {transaction.metadata?.expertName && (
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Specialist</p>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase truncate">{transaction.metadata.expertName}</p>
              </div>
            )}
            {transaction.metadata?.date && (
              <div>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Session Date</p>
                <p className="text-[10px] font-bold text-slate-600 dark:text-slate-300 uppercase">{transaction.metadata.date}</p>
              </div>
            )}
            <div>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Security</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                <CheckCircle2 size={10} /> Verified
              </p>
            </div>
          </div>
        )}
      </motion.div>

      <ReceiptModal 
        isOpen={showReceipt} 
        onClose={() => setShowReceipt(false)} 
        transaction={transaction} 
      />
    </>
  );
};

export const EmptyTransactions = () => (
  <div className="text-center py-32 bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10">
    <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-300">
      <CreditCard size={40} />
    </div>
    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">No Acquisitions Found</h3>
    <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Your clinical billing history will appear here once you scale your node or book consultations.</p>
  </div>
);
