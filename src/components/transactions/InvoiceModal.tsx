'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, X, ShieldCheck, Globe, CreditCard, Download } from 'lucide-react';
import { Transaction } from '@/services/paymentService';
import { useTranslations } from 'next-intl';

interface InvoiceModalProps {
  transaction: Transaction;
  onClose: () => void;
  formatPlanName: (tier: string) => string;
}

export function InvoiceModal({ transaction, onClose, formatPlanName }: InvoiceModalProps) {
  const t = useTranslations('invoice');
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [printMode, setPrintMode] = useState<'color' | 'bw'>('color');

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-xl print:bg-white print:p-0"
    >
      {/* Interactive Toolbar - Hidden during print */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-6 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl print:hidden">
        <div className="flex bg-black/20 p-1 rounded-full border border-white/5">
          <button 
            onClick={() => setPrintMode('color')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${printMode === 'color' ? 'bg-white text-blue-600 shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            {t('clinicalColor')}
          </button>
          <button 
            onClick={() => setPrintMode('bw')}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${printMode === 'bw' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/60 hover:text-white'}`}
          >
            {t('noirArchive')}
          </button>
        </div>
        
        <div className="w-px h-6 bg-white/10 mx-1" />
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-blue-600/20"
        >
          <Printer size={14} /> {t('printReceipt')}
        </button>

        <button 
          onClick={onClose}
          className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all active:scale-90 border border-white/10"
        >
          <X size={20} />
        </button>
      </div>

      <motion.div 
        initial={{ scale: 0.95, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 30, opacity: 0 }}
        className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto sm:rounded-[48px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] print:shadow-none print:rounded-none print:max-h-none print:overflow-visible custom-scrollbar"
      >
        <div 
          ref={invoiceRef}
          className={`p-10 sm:p-20 space-y-16 bg-white text-slate-900 min-h-[800px] transition-all duration-700 relative overflow-hidden ${
            printMode === 'bw' 
              ? 'grayscale contrast-[1.2] brightness-100' 
              : 'grayscale-0'
          } print:p-0 print:m-0`}
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/noise.svg")' }} />
          
          {/* Brand Watermark */}
          <div className="absolute -right-20 -top-20 opacity-[0.02] pointer-events-none">
             <Globe size={400} />
          </div>

          {/* Header */}
          <div className="flex justify-between items-start relative z-10">
            <div className="space-y-8">
               <div className="flex items-center gap-5">
                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white transition-all duration-700 shadow-2xl ${printMode === 'color' ? 'bg-slate-900 rotate-3' : 'bg-black'}`}>
                   <span className="font-black text-4xl">I</span>
                 </div>
                 <div className="leading-tight">
                    <span className="block font-black text-3xl tracking-tighter uppercase">Ikiké Health AI</span>
                    <span className={`text-[10px] font-black uppercase tracking-[0.5em] transition-colors duration-700 ${printMode === 'color' ? 'text-blue-600' : 'text-black'}`}>{t('intelNode')}</span>
                 </div>
               </div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-loose">
                 No. 1 Okon Essien Street<br />
                 Uyo, Akwa Ibom, NG<br />
                 <span className="text-slate-900">billing@ikikehealth.ai</span>
               </div>
            </div>
            <div className="text-right space-y-4">
               <div className={`inline-flex px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${printMode === 'color' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-black'}`}>
                 {t('receipt')}
               </div>
               <div className="text-[12px] font-black uppercase tracking-widest text-slate-900 flex items-center justify-end gap-2">
                 <span className="text-slate-300">ID:</span> #{transaction.id.substring(0, 14).toUpperCase()}
               </div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {new Date(transaction.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
               </div>
            </div>
          </div>

          <div className={`h-px w-full transition-colors duration-700 ${printMode === 'color' ? 'bg-slate-100' : 'bg-black'}`} />

          {/* Details Section */}
          <div className="grid grid-cols-2 gap-20 relative z-10">
             <div className="space-y-6">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 border-b border-slate-50 pb-2">{t('billTo')}</h4>
                <div className="space-y-2">
                   <div className="font-black text-xl text-slate-900 uppercase tracking-tight">{transaction.metadata?.name || t('authorizedMember')}</div>
                   <div className="text-xs font-bold text-slate-500 lowercase tracking-tight flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                     {transaction.metadata?.email || 'N/A'}
                   </div>
                </div>
             </div>
             <div className="space-y-6 text-right">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-300 border-b border-slate-50 pb-2 text-right">{t('issuedOn')}</h4>
                <div className="space-y-2">
                   <div className="font-black text-xl text-slate-900 uppercase tracking-tight">
                     {new Date(transaction.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                   </div>
                   <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                     {new Date(transaction.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
                   </div>
                </div>
             </div>
          </div>

          {/* Transaction Table */}
          <div className="space-y-8 relative z-10">
             <div className={`grid grid-cols-12 gap-4 pb-6 border-b-2 text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors duration-700 ${printMode === 'color' ? 'border-slate-100' : 'border-black'}`}>
                <div className="col-span-8">{t('protocol')}</div>
                <div className="col-span-4 text-right">{t('amount')}</div>
             </div>
             
             <div className="grid grid-cols-12 gap-4 items-center py-4">
                <div className="col-span-8 space-y-3">
                   <div className="font-black text-2xl text-slate-900 uppercase tracking-tight">{formatPlanName(transaction.metadata?.tier || transaction.tier || 'Basic')}</div>
                   <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors duration-700 ${printMode === 'color' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-black'}`} />
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest font-mono">{t('cycle')}</span>
                   </div>
                </div>
                <div className="col-span-4 text-right">
                   <div className="text-3xl font-black text-slate-900 tracking-tighter">₦{transaction.amount.toLocaleString()}</div>
                </div>
             </div>
          </div>

          {/* Pricing Highlight */}
          <div className="relative pt-10">
             <div className={`absolute left-0 right-0 top-0 h-2 transition-colors duration-700 ${printMode === 'color' ? 'bg-slate-900' : 'bg-black'}`} />
             
             <div className="flex justify-between items-end pt-12">
                <div className="max-w-[320px] space-y-6">
                   <div className={`flex items-center gap-3 transition-colors duration-700 ${printMode === 'color' ? 'text-emerald-600' : 'text-black'}`}>
                      <ShieldCheck size={24} className={printMode === 'color' ? 'animate-pulse' : ''} />
                      <span className="text-[12px] font-black uppercase tracking-[0.4em]">{t('synchronized')}</span>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-tight">
                     {t('footerDesc')}
                   </p>
                </div>
                
                <div className="text-right">
                   <span className="text-[12px] font-black uppercase text-slate-400 tracking-[0.3em] mb-4 block">{t('total')}</span>
                   <div className="text-7xl font-black tracking-tighter text-slate-900 flex items-start justify-end">
                      <span className="text-2xl mt-2 mr-2">₦</span>
                      {transaction.amount.toLocaleString()}
                   </div>
                </div>
             </div>
          </div>
          
          {/* Bottom Badge */}
          <div className="pt-24 text-center pb-10">
             <div className="inline-flex items-center gap-4 px-8 py-3 bg-slate-50 rounded-full border border-slate-100 shadow-inner">
                <Globe size={16} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.8em]">{t('standard')}</span>
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
