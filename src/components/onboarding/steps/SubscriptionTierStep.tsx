'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Award, Crown, Shield, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { paymentService } from '@/services/paymentService';

interface SubscriptionTierStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function SubscriptionTierStep({ formData, setFormData }: SubscriptionTierStepProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const tiers = [
    { 
      id: 'basic', 
      name: 'Basic Node', 
      price: 'Free', 
      icon: <Zap className="w-5 h-5" />,
      features: ['Search Directory', 'Public Articles', 'Basic AI Summary']
    },
    { 
      id: 'professional', 
      name: 'Professional Hub', 
      price: '$29/mo', 
      icon: <Award className="w-5 h-5" />,
      features: ['Priority Verification', 'Video Consultations', 'Advanced Analytics'],
      popular: true
    }
  ];

  const handleSelectTier = async (tierId: string) => {
    // If it's the free tier, just update form data
    if (tierId === 'basic') {
      setFormData({ ...formData, tier: 'basic' });
      return;
    }

    // If it's a paid tier, initialize payment protocol
    setLoading(tierId);
    setError(null);
    try {
      const { url } = await paymentService.createCheckoutSession(tierId as any);
      if (url) {
        window.location.href = url;
      }
    } catch (err: any) {
      setError(err.message || "Protocol initialization failed.");
      setLoading(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }} 
      className="space-y-10"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
          <Crown size={12} />
          Network Scaling
        </div>
        
        <div className="space-y-1">
          <h3 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
            Choose your <span className="text-blue-600">Tier.</span>
          </h3>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
            Select an authority level to unlock advanced clinical features and network growth tools.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {tiers.map((tier) => {
          const isSelected = formData.tier === tier.id;
          const isProcessing = loading === tier.id;

          return (
            <button
              key={tier.id}
              disabled={!!loading}
              onClick={() => handleSelectTier(tier.id)}
              className={`flex flex-col p-8 rounded-[40px] border-2 text-left transition-all duration-500 relative group ${
                isSelected
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-blue-500/30'
              } ${loading && !isProcessing ? 'opacity-50 grayscale' : ''}`}
            >
              {tier.popular && !isSelected && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
                  Most Popular
                </div>
              )}

              <div className="flex justify-between items-start mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                }`}>
                  {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : tier.icon}
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{tier.price}</p>
                  <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>per month</p>
                </div>
              </div>

              <h4 className={`text-xl font-black uppercase tracking-tight mb-6 ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                {tier.name}
              </h4>

              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <div className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}>
                      <Check size={10} strokeWidth={4} />
                    </div>
                    <span className={`text-xs font-bold ${isSelected ? 'text-blue-50' : 'text-slate-500 dark:text-slate-400'}`}>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className={`mt-auto w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all ${
                isSelected ? 'bg-white text-blue-600 shadow-lg' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              }`}>
                {isProcessing ? 'Securing Channel...' : isSelected ? 'Selected Node' : 'Initialize Tier'}
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
          {error}
        </div>
      )}

      <div className="p-6 bg-slate-50 dark:bg-white/[0.02] rounded-[32px] border border-slate-100 dark:border-white/5 flex gap-4">
        <Shield className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
          Tiers can be adjusted at any time from your intelligence console. Subscriptions are billed securely through encrypted channels.
        </p>
      </div>
    </motion.div>
  );
}
