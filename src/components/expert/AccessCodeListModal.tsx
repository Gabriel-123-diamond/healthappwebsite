'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Key, Copy, Check, Trash2, Hourglass, Users, AlertCircle, Shield } from 'lucide-react';
import { AccessCode } from '@/services/expertDashboardService';

interface AccessCodeListModalProps {
  isOpen: boolean;
  onClose: () => void;
  codes: AccessCode[];
  onDelete: (id: string) => void;
  onCopy: (code: string) => void;
}

function CodeCountdown({ expiresAt }: { expiresAt: Date }) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isNearExpiry, setIsNearExpiry] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const diff = new Date(expiresAt).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('Expired');
        setIsNearExpiry(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setIsNearExpiry(diff < 1000 * 60 * 60); // Less than 1 hour

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        return setTimeLeft(`${days}d ${hours % 24}h ${minutes}m ${seconds}s`);
      }
      
      return setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-slate-400">
        <Hourglass size={12} className={isNearExpiry ? 'text-amber-500 animate-pulse' : ''} />
        <span className="text-[8px] font-black uppercase tracking-widest">Time Buffer</span>
      </div>
      <p className={`text-xs font-black font-mono ${isNearExpiry ? 'text-amber-500' : 'text-slate-600 dark:text-slate-300'}`}>
        {timeLeft}
      </p>
    </div>
  );
}

export function AccessCodeListModal({ isOpen, onClose, codes, onDelete, onCopy }: AccessCodeListModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (code: string, id: string) => {
    onCopy(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
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
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/20">
                <Key className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Nodes</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Operational Protocol History</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
            {codes.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-slate-800">
                  <AlertCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">No active access nodes found.</p>
              </div>
            ) : (
              codes.map((item) => {
                const expiryDate = new Date(item.expiresAt);
                const isExpired = expiryDate < new Date();
                const isLimitReached = item.usageLimit > 0 && item.usageCount >= item.usageLimit;
                const isActive = !isExpired && !isLimitReached;

                return (
                  <motion.div
                    key={item.id}
                    layout
                    className={`p-6 rounded-[32px] border transition-all ${
                      isActive 
                        ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 shadow-sm' 
                        : 'bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          <Key size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Node</p>
                          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-widest">{item.code}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 md:border-l md:pl-6 border-slate-100 dark:border-white/5">
                        <CodeCountdown expiresAt={expiryDate} />

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Users size={12} />
                            <span className="text-[8px] font-black uppercase tracking-widest">Usage Load</span>
                          </div>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            {item.usageCount} / {item.usageLimit === 0 ? '∞' : item.usageLimit}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(item.code, item.id)}
                            className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors shadow-sm"
                          >
                            {copiedId === item.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                          </button>
                          <button
                            onClick={() => onDelete(item.id)}
                            className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-400 hover:text-red-600 transition-colors shadow-sm"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {!isActive && (
                      <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-xl border border-amber-100 dark:border-amber-800/30">
                        <AlertCircle size={12} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {isExpired ? 'Node Life Cycle Expired' : 'Usage Limit Capacity Reached'}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Security Protocol</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  These access nodes allow patients to find your professional profile privately. Codes automatically purge after expiration for data integrity.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
