'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, CreditCard, Crown, Check } from 'lucide-react';

interface NiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'success' | 'warning' | 'info' | 'payment' | 'upgrade';
  isLoading?: boolean;
  isPopup?: boolean;
  features?: string[];
}

export default function NiceModal({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = 'info',
  isLoading = false,
  isPopup = false,
  features = []
}: NiceModalProps) {
  
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.userSelect = '';
    };
  }, [isOpen]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-8 h-8 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-8 h-8 text-amber-500" />;
      case 'payment': return <CreditCard className="w-8 h-8 text-blue-600" />;
      case 'upgrade': return <Crown className="w-8 h-8 text-amber-500" />;
      default: return <Info className="w-8 h-8 text-blue-500" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'success': return "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20";
      case 'warning': return "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20";
      case 'payment': return "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20";
      case 'upgrade': return "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-500/20";
      default: return "bg-white dark:bg-slate-900 text-slate-900 dark:text-white";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop with High Blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl cursor-pointer pointer-events-auto"
          />

          {/* Modal Card - 100% Opaque Solid Background */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className={`relative w-[calc(100%-2rem)] ${isPopup ? 'max-w-[420px] shadow-2xl dark:shadow-black ring-1 ring-slate-200 dark:ring-slate-800' : 'max-w-md shadow-3xl'} bg-white dark:bg-[#0B1221] rounded-[48px] border border-slate-200 dark:border-white/10 overflow-hidden z-10 pointer-events-auto select-text`}
          >
            {/* Top Premium Pattern Decor */}
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-slate-100 dark:from-white/[0.05] to-transparent pointer-events-none" />
            
            <div className={`relative ${isPopup ? 'p-10' : 'p-10 sm:p-12'} text-center`}>
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 transition-colors z-20"
              >
                <X size={20} />
              </button>

              <div className={`inline-flex ${isPopup ? 'p-5' : 'p-6'} rounded-[28px] bg-slate-100 dark:bg-white/5 mb-8 shadow-inner ring-1 ring-slate-200 dark:ring-white/10`}>
                {getIcon()}
              </div>

              <h3 className={`${isPopup ? 'text-2xl' : 'text-3xl'} font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight uppercase`}>
                {title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed mb-8">
                {description}
              </p>

              {/* Dynamic Benefits List for Upgrades */}
              {features.length > 0 && (
                <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 mb-8 text-left space-y-3 border border-slate-100 dark:border-white/5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Premium Benefits:</p>
                  {features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-amber-500" strokeWidth={4} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-3">
                {onConfirm && (
                  <button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className={`w-full py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all active:scale-95 shadow-2xl disabled:opacity-50 ${getButtonClass()}`}
                  >
                    {isLoading ? "Processing..." : confirmText}
                  </button>
                )}
                <button
                  onClick={onCancel || onClose}
                  disabled={isLoading}
                  className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-all active:scale-95"
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
