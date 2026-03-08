'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Shield, Zap, Info } from 'lucide-react';

interface CodeExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (expiryHours: number, usageLimit: number) => void;
  isGenerating: boolean;
}

const EXPIRY_OPTIONS = [
  { label: '1 Hour', value: 1, desc: 'Ultra-short window' },
  { label: '6 Hours', value: 6, desc: 'Standard clinical session' },
  { label: '12 Hours', value: 12, desc: 'Half-day access' },
  { label: '24 Hours', value: 24, desc: 'Full-day visibility', isDefault: true },
  { label: '7 Days', value: 168, desc: 'Extended monitoring' },
];

export function CodeExpiryModal({ isOpen, onClose, onGenerate, isGenerating }: CodeExpiryModalProps) {
  const [selectedExpiry, setSelectedExpiry] = useState(24);
  const [usageLimit, setUsageLimit] = useState(0);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-500/20">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Set Expiration</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Define code lifespan</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 gap-3">
              {EXPIRY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedExpiry(opt.value)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    selectedExpiry === opt.value
                      ? 'bg-indigo-500/5 border-indigo-500 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:border-indigo-500/30'
                  }`}
                >
                  <div className="text-left">
                    <p className={`text-sm font-black uppercase tracking-widest ${selectedExpiry === opt.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      {opt.label}
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter mt-0.5">{opt.desc}</p>
                  </div>
                  {selectedExpiry === opt.value && (
                    <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Usage Limit Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Usage Limit</h4>
                  <div className="group relative">
                    <Info size={12} className="text-slate-300 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-40 p-2 bg-slate-800 text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                      Set to 0 for unlimited uses within the expiration period.
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                  {usageLimit === 0 ? 'Unlimited' : `${usageLimit} Uses`}
                </span>
              </div>
              <input 
                type="number" 
                min="0"
                value={usageLimit}
                onChange={(e) => setUsageLimit(parseInt(e.target.value) || 0)}
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                placeholder="Enter usage limit (0 for unlimited)"
              />
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-start gap-3 border border-blue-100 dark:border-blue-800/50">
               <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
               <p className="text-[10px] text-blue-700 dark:text-blue-300 font-medium leading-relaxed">
                 Once the code expires or reaches its usage limit, it will be automatically purged. You can manage all active nodes from your dashboard.
               </p>
            </div>

            <button
              onClick={() => onGenerate(selectedExpiry, usageLimit)}
              disabled={isGenerating}
              className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-500/10 disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Confirm & Generate'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
