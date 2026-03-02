'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, CreditCard } from 'lucide-react';

interface NiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'warning' | 'info' | 'payment';
  isLoading?: boolean;
}

export default function NiceModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'info',
  isLoading = false
}: NiceModalProps) {
  
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-8 h-8 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-8 h-8 text-amber-500" />;
      case 'payment': return <CreditCard className="w-8 h-8 text-blue-600" />;
      default: return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success': return "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200";
      case 'warning': return "bg-amber-600 hover:bg-amber-700 shadow-amber-200";
      case 'payment': return "bg-blue-600 hover:bg-blue-700 shadow-blue-200";
      default: return "bg-slate-900 dark:bg-white text-white dark:text-slate-900";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-[#0B1221] rounded-[40px] shadow-3xl border border-white/20 overflow-hidden"
          >
            {/* Top Pattern Decor */}
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50 dark:from-white/5 to-transparent pointer-events-none" />
            
            <div className="relative p-8 sm:p-10 text-center">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="inline-flex p-5 rounded-3xl bg-slate-50 dark:bg-white/5 mb-6 shadow-inner ring-1 ring-slate-100 dark:ring-white/5">
                {getIcon()}
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
                {title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-10">
                {description}
              </p>

              <div className="flex flex-col gap-3">
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95 shadow-xl disabled:opacity-50 ${getButtonClass()}`}
                  >
                    {isLoading ? "Processing..." : confirmText}
                  </button>
                )}
                <button
                  onClick={onClose}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all active:scale-95"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
