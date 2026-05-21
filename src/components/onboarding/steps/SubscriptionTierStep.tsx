'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Award, Crown, Shield } from 'lucide-react';
import { Tier, TierButton } from './SubscriptionTierComponents';

interface SubscriptionTierStepProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function SubscriptionTierStep({ formData, setFormData }: SubscriptionTierStepProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getTiers = (): Tier[] => {
    const basic: Tier = { 
      id: 'basic', 
      name: 'Basic Node', 
      price: 'Free', 
      icon: <Zap className="w-5 h-5" />,
      features: ['Profile Listing', 'Searchable Directory', 'Limited Visibility']
    };

    if (formData.role === 'hospital') {
      return [
        { 
          id: 'clinic', 
          name: 'Clinic Node', 
          price: 'Free', 
          icon: <Zap className="w-5 h-5" />,
          features: ['Profile Listing', 'Searchable Directory', 'Limited Visibility']
        },
        { 
          id: 'hospital', 
          name: 'Hospital Listing', 
          price: '$100/mo', 
          icon: <Award className="w-5 h-5" />,
          features: ['Doctor Directory', 'Patient Reviews', 'Appointment Booking'],
          popular: true
        },
        { 
          id: 'network', 
          name: 'Network Listing', 
          price: '$400/mo', 
          icon: <Crown className="w-5 h-5" />,
          features: ['Featured Placement', 'Advertising Banner', 'Video Promotion']
        }
      ];
    }

    if (formData.role === 'user') {
      return [
        {
          id: 'free',
          name: 'Basic Node',
          price: 'Free',
          icon: <Zap className="w-5 h-5" />,
          features: ['Public Directory Access', 'Standard Search', 'Direct Consultations']
        },
        { 
          id: 'plus', 
          name: 'PLUS', 
          description: 'Unlock essential clinical intelligence',
          price: '$5/mo', 
          icon: <Zap className="w-5 h-5" />,
          features: [
            'Unlimited AI Health Chat', 
            'Personalized Health Insights', 
            'Medical Vault (Records)', 
            'Priority Search Placement'
          ],
          popular: true
        },
        {
          id: 'elite',
          name: 'ELITE',
          description: 'Everything in PLUS + advanced clinical nodes',
          price: '$12/mo',
          icon: <Crown className="w-5 h-5" />,
          features: [
            'Everything in PLUS +', 
            'Family Node (4 Members)', 
            'Direct Video Consultations', 
            'Unlimited Expert Q&A', 
            'Advanced Health Trends', 
            'Early Access to New Nodes'
          ],
          popular: false
        }
      ];
    }

    if (formData.role === 'doctor') {
      return [
        basic,
        { 
          id: 'professional', 
          name: 'Professional - GROWTH', 
          description: 'Scale your professional clinical presence',
          price: '$25/mo', 
          icon: <Award className="w-5 h-5" />,
          features: ['Verified Pro Badge', 'Enhanced Analytics', 'Standard Visibility', 'Priority Support Node'],
          popular: true
        },
        { 
          id: 'authority', 
          name: 'Authority - ELITE', 
          description: 'Dominant authority node in the health grid',
          price: '$100/mo', 
          icon: <Crown className="w-5 h-5" />,
          features: ['Top-of-Search Placement', 'Featured Expert Badge', 'Advanced AI Profile Insights', 'Reduced Service Commission'],
          popular: false
        }
      ];
    }

    // Default: Wellness Practitioner
    return [
      { 
        id: 'standard', 
        name: 'Standard Listing', 
        price: 'Free', 
        icon: <Zap className="w-5 h-5" />,
        features: ['Profile Listing', 'Searchable Directory', 'Limited Visibility']
      },
      { 
        id: 'vip1', 
        name: 'VIP 1 - INSIGHTS', 
        description: 'Expand your holistic wellness reach',
        price: '$15/mo', 
        icon: <Award className="w-5 h-5" />,
        features: ['Verified Badge', 'Up to 3 Active Products', 'Standard Visibility', 'Priority Support'],
        popular: true
      },
      { 
        id: 'vip2', 
        name: 'VIP 2 - DISPENSARY', 
        description: 'Full-featured holistic dispensary and course access',
        price: '$75/mo', 
        icon: <Crown className="w-5 h-5" />,
        features: ['Featured Placement', 'Unlimited Active Products', 'Digital Course Creator', 'Advanced AI profile suggestions'],
        popular: false
      }
    ];
  };

  const tiers = getTiers();

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
      // For demo purposes, we'll just set the tier and continue after a delay
      // In a real app, this would redirect to a payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));
      setFormData({ ...formData, tier: tierId });
      setLoading(null);
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
            Select an authority level to unlock advanced clinical features and network growth tools for your {formData.role === 'hospital' ? 'institution' : 'practice'}.
          </p>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${tiers.length > 2 ? 'lg:grid-cols-3' : 'md:grid-cols-2'} gap-6 sm:gap-8`}>
        {tiers.map((tier) => (
          <TierButton
            key={tier.id}
            tier={tier}
            isSelected={formData.tier === tier.id}
            isProcessing={loading === tier.id}
            isDisabled={!!loading}
            onClick={() => handleSelectTier(tier.id)}
          />
        ))}
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
