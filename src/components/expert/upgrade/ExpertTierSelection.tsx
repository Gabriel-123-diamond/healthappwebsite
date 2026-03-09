'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Sparkles, CheckCircle2, Zap, Loader2 } from 'lucide-react';

interface ExpertTierSelectionProps {
  onUpgrade: (tier: 'basic' | 'professional' | 'standard' | 'premium') => void;
  isSubmitting: boolean;
}

export const ExpertTierSelection: React.FC<ExpertTierSelectionProps> = ({ onUpgrade, isSubmitting }) => {
  return (
    <motion.div
      key="step4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
          <Award size={12} /> Verified Specialist
        </div>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Choose Your Tier</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Unlock priority placement and consultation features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Professional Tier */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 hover:border-blue-600 transition-all flex flex-col h-full">
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                <Sparkles size={32} />
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Monthly</span>
                <span className="text-3xl font-black text-slate-900 dark:text-white">$20</span>
              </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">Professional</h3>
            <ul className="space-y-4 flex-1">
              {['Verified Badge', 'Priority Directory Listing', 'Patient Inquiries', 'Profile Analytics'].map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onUpgrade('professional')}
              disabled={isSubmitting}
              className="mt-8 w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Upgrade to Professional'}
            </button>
          </div>
        </div>

        {/* Premium Tier */}
        <div className="relative group">
          <div className="absolute inset-0 bg-indigo-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="relative bg-slate-900 dark:bg-white p-8 rounded-[40px] border-2 border-slate-800 dark:border-slate-100 hover:border-indigo-600 transition-all flex flex-col h-full text-white dark:text-slate-900">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full">
              Maximum Exposure
            </div>
            <div className="flex justify-between items-start mb-8">
              <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-100 text-indigo-400">
                <Zap size={32} />
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Monthly</span>
                <span className="text-3xl font-black">$100</span>
              </div>
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Premium</h3>
            <ul className="space-y-4 flex-1">
              {['All Professional Features', 'Featured Home Placement', 'Video Consultations', 'Appointment Booking'].map((feat) => (
                <li key={feat} className="flex items-center gap-3 text-sm font-bold opacity-80">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0" /> {feat}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onUpgrade('premium')}
              disabled={isSubmitting}
              className="mt-8 w-full py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-white/10 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Unlock Premium Access'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
