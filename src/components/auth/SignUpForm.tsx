import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail, ArrowRight, Ticket, ShieldCheck } from 'lucide-react';
import { BaseInput } from '@/components/common/BaseInput';
import { PasswordField } from '@/components/common/PasswordField';

interface SignUpFormProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  referralCode: string;
  setReferralCode: (val: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  t: (key: string) => string;
}

export const SignUpForm = ({
  email, setEmail,
  password, setPassword,
  confirmPassword, setConfirmPassword,
  referralCode, setReferralCode,
  loading, error,
  onSubmit, t
}: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-7 relative">
      <BaseInput
        id="email"
        label={t('emailLabel')}
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('emailPlaceholder')}
        autoComplete="email"
        prefixIcon={<Mail className="w-4 h-4 text-slate-400" />}
        className="dark:bg-black/20"
      />

      <PasswordField
        id="password"
        name="password"
        label={t('passwordLabel')}
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder={t('passwordPlaceholder')}
        autoComplete="new-password"
        className="dark:bg-black/20"
      />

      <PasswordField
        id="confirmPassword"
        name="confirmPassword"
        label={t('confirmPasswordLabel')}
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t('passwordPlaceholder')}
        autoComplete="new-password"
        className="dark:bg-black/20"
      />

      <div className="pt-2 border-t border-slate-100 dark:border-white/5">
        <BaseInput
          id="referralCode"
          label="Referral Code (Optional)"
          type="text"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
          placeholder="REF-XXXXXXX"
          prefixIcon={<Ticket className="w-4 h-4 text-blue-500" />}
          className="dark:bg-black/20 font-black tracking-widest uppercase placeholder:font-normal placeholder:tracking-normal"
        />
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-start gap-4 relative overflow-hidden group/error"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover/error:opacity-100 transition-opacity" />
          <div className="shrink-0 w-10 h-10 rounded-2xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <ShieldCheck className="text-white w-5 h-5" />
          </div>
          <div className="space-y-1 relative z-10">
            <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Security Alert</p>
            <p className="text-red-600 dark:text-red-400 text-[11px] font-bold leading-relaxed">{error}</p>
          </div>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.01, boxShadow: '0 0 25px rgba(37, 99, 235, 0.4)' }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="w-full py-6 bg-slate-900 dark:bg-blue-600 text-white rounded-[28px] font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-4 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-xl shadow-slate-900/10 dark:shadow-blue-500/20 disabled:opacity-50 relative group/btn overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <span className="relative z-10 flex items-center gap-4">
            Generate Node <ArrowRight size={18} strokeWidth={3} className="group-hover:translate-x-1.5 transition-transform" />
          </span>
        )}
      </motion.button>
    </form>
  );
};
