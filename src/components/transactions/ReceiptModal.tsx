import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ShieldCheck, Printer, CheckCircle2 } from 'lucide-react';
import type { Transaction } from './TransactionComponents';
import { formatPlanName } from './TransactionComponents';

export const ReceiptModal = ({ isOpen, onClose, transaction }: { isOpen: boolean, onClose: () => void, transaction: Transaction }) => {
  const date = new Date(transaction.timestamp).toLocaleDateString(undefined, { 
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const planTier = transaction.metadata?.tier || (transaction as any).tier;
  const planName = planTier ? formatPlanName(planTier) : null;

  const getTypeInfo = () => {
    switch(transaction.type) {
      case 'upgrade': return { label: 'Protocol Upgrade', desc: 'Clinical Node Scaling' };
      case 'expert_upgrade': return { label: 'Registry Fee', desc: 'Expert Clinical Verification' };
      case 'appointment': return { label: 'Consultation Fee', desc: 'Specialist Session Booking' };
      default: return { label: 'Clinical Acquisition', desc: 'General Service Payment' };
    }
  };

  const typeInfo = getTypeInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-[#0B1221] rounded-[40px] shadow-3xl overflow-hidden border border-slate-100 dark:border-white/5"
          >
            {/* Header Decor */}
            <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 flex items-end justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20" />
              <div className="relative z-10">
                <h2 className="text-white font-black uppercase tracking-widest text-lg">Acquisition Receipt</h2>
                <p className="text-blue-100 text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">Official Clinical Record</p>
              </div>
              <button onClick={onClose} className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Ref</p>
                  <p className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300">{transaction.id}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{date}</p>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-white/5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{planName || typeInfo.label}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{planName ? typeInfo.label : typeInfo.desc}</p>
                  </div>
                  <p className="text-lg font-black text-slate-900 dark:text-white">₦{transaction.amount.toLocaleString()}</p>
                </div>
                
                {planTier && (
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Target Protocol</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">{planName || planTier}</span>
                  </div>
                )}

                {transaction.metadata?.expertName && (
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-400">Specialist Node</span>
                    <span className="text-slate-600 dark:text-slate-300 font-black">{transaction.metadata.expertName}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-slate-200/50 dark:border-white/5">
                  <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Total Clinical Fee</span>
                  <span className="text-2xl font-black text-blue-600">₦{transaction.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 justify-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full border border-emerald-100 dark:border-emerald-800/30">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secured AES-256</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full border border-blue-100 dark:border-blue-800/30">
                  <CheckCircle2 size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Verified Payment</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <button className="flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all active:scale-95">
                  <Download size={14} /> Download PDF
                </button>
                <button onClick={() => window.print()} className="flex items-center justify-center gap-2 py-4 bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-white/20 transition-all active:scale-95">
                  <Printer size={14} /> Print Copy
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 dark:bg-white/[0.02] p-6 text-center border-t border-slate-100 dark:border-white/5">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Official Ikiké Health AI Clinical Protocol Acquisition Record</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
