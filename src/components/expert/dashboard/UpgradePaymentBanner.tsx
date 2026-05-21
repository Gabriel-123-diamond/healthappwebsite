'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Sparkles, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { paymentService } from '@/services/paymentService';
import { UserProfile } from '@/types';

interface UpgradePaymentBannerProps {
  profile: UserProfile;
  onSuccess: () => void;
}

export const UpgradePaymentBanner: React.FC<UpgradePaymentBannerProps> = ({ profile, onSuccess }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);

  if (profile.upgradeStatus !== 'pending_payment') return null;

  const targetTier = profile.requestedTier || 'professional';
  const amount = targetTier === 'premium' ? 100 : 20;

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      await paymentService.initializePayment({
        email: profile.email,
        amount: amount,
        metadata: {
          uid: profile.uid,
          tier: targetTier,
          type: 'tier_upgrade'
        },
        onSuccess: async (ref) => {
          const res = await fetch('/api/user/upgrade', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${await (window as any).firebaseAuthToken}` 
            },
            body: JSON.stringify({ tier: targetTier, reference: ref.reference }),
          });
          if (res.ok) onSuccess();
        },
        onClose: () => setIsProcessing(false)
      });
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 bg-slate-900 dark:bg-black rounded-[32px] p-8 border border-white/10 shadow-2xl relative overflow-hidden group"
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -ml-32 -mb-32" />

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
            {targetTier === 'premium' ? <Zap size={40} /> : <Sparkles size={40} />}
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Upgrade Approved!</h2>
            <p className="text-slate-400 font-medium max-w-md mt-1">
              Your {targetTier} credentials have been verified. Complete the payment to activate your new authority status.
            </p>
          </div>
        </div>

        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="w-full md:w-auto flex items-center justify-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-blue-50 transition-all shadow-xl active:scale-95 disabled:opacity-50"
        >
          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>Pay ${amount} to Activate <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </motion.div>
  );
};
