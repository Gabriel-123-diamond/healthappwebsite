import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, RefreshCw } from 'lucide-react';

interface VerificationCardProps {
  id: string;
  label: string;
  value: string;
  icon: React.ReactNode;
  status: 'idle' | 'sending' | 'sent' | 'verified';
  otpValue: string;
  setOtpValue: (val: string) => void;
  onSend: () => void;
  onVerify: () => void;
  onReset: () => void;
  isResumed: boolean;
  actionLabel: string;
  t: any;
}

export function VerificationCard({ id, label, value, icon, status, otpValue, setOtpValue, onSend, onVerify, onReset, isResumed, actionLabel, t }: VerificationCardProps) {
  const isVerified = status === 'verified';
  const isSent = status === 'sent';
  const isSending = status === 'sending';

  return (
    <div className={`group relative p-4 sm:p-6 md:p-7 rounded-[32px] border-2 transition-all duration-500 ${
      isVerified 
        ? 'bg-emerald-500/5 border-emerald-500/30 dark:bg-emerald-900/5' 
        : 'bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm'
    }`}>
      {/* Background decoration to fill space */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50/30 dark:to-white/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="relative flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <motion.div 
            layout
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500 ${
            isVerified 
              ? 'bg-emerald-500 text-white shadow-lg' 
              : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600'
          }`}>
            {icon}
          </motion.div>
          
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{label}</p>
              <AnimatePresence>
                {isResumed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 bg-blue-500/10 text-blue-600 rounded-full border border-blue-500/20"
                  >
                    Saved
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <p className="text-base sm:text-lg md:text-xl font-black text-slate-900 dark:text-white break-words leading-tight tracking-tight">
              {value}
            </p>
          </div>
        </div>

        <div className="shrink-0 w-full xl:w-auto">
          <AnimatePresence mode="wait">
            {isVerified ? (
              <motion.div 
                key="verified"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center xl:justify-end gap-3 px-5 py-2.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-500/20 w-full xl:w-auto shadow-sm"
              >
                <CheckCircle2 size={16} strokeWidth={3} />
                <span className="text-[10px] font-black uppercase tracking-widest">{t('verifiedMember')}</span>
              </motion.div>
            ) : (
              <motion.div 
                key="actions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 w-full xl:w-auto"
              >
                {isSent && (
                  <div className="flex-1 flex items-center gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="------"
                      className="w-full sm:w-32 px-4 py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-blue-500 rounded-xl text-center font-mono font-black text-lg tracking-[0.3em] outline-none shadow-inner"
                    />
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onVerify}
                      className="px-6 py-3.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      Confirm
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onReset}
                      className="p-3 sm:p-3.5 text-slate-400 hover:text-blue-600 transition-all bg-slate-50 dark:bg-slate-800 rounded-xl border border-transparent hover:border-blue-500/20 shadow-sm"
                      title={t('editInfo')}
                    >
                      <RefreshCw size={18} />
                    </motion.button>
                  </div>
                )}
                {!isSent && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSend}
                    disabled={isSending}
                    className={`flex-1 xl:flex-none px-6 sm:px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 xl:min-w-[180px] ${
                      isSending
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700 pointer-events-none'
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg hover:shadow-blue-500/20'
                    }`}
                  >
                    {isSending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>{actionLabel} <ArrowRightIcon /></>
                    )}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon() {
  return (
    <motion.svg 
      width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 7H17M17 7L11 1M17 7L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </motion.svg>
  );
}
