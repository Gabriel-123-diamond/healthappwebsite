'use client';

import React, { useState } from 'react';
import { Users as UsersIcon, Copy, Link as LinkIcon, RefreshCw, Share2, Download, Loader2, Sparkles, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { referralService, REWARD_POINTS } from '@/services/referralService';
import { exportData } from '@/services/dataService';
import { User } from 'firebase/auth';
import PointsBadge from '../common/PointsBadge';

interface ProfileStatsProps {
  user: User;
  userProfile: any;
  referralCode: string;
  setReferralCode: (code: string) => void;
  t: any;
}

export default function ProfileStats({ user, userProfile, referralCode, setReferralCode, t }: ProfileStatsProps) {
  const [generating, setGenerating] = useState(false);
  const [processingExport, setProcessingExport] = useState(false);

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const username = userProfile?.username || user.displayName || 'USER';
      const newCode = await referralService.generateReferralCode(user.uid, username);
      setReferralCode(newCode);
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyCodeOnly = () => {
    if (referralCode === '...' || referralCode === 'NO CODE') return;
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied!');
  };

  const copyLink = () => {
    if (referralCode === '...' || referralCode === 'NO CODE') return;
    const link = referralService.getReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    alert('Referral link copied!');
  };

  const handleShare = async () => {
    if (referralCode === '...' || referralCode === 'NO CODE') return;
    const link = referralService.getReferralLink(referralCode);
    const shareData = {
      title: 'Join me on Ikiké Health AI',
      text: `Join me on Ikiké Health AI and let's discover holistic health together! Use my referral code: ${referralCode} to get ${REWARD_POINTS} bonus points.`,
      url: link,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyLink();
    }
  };

  const handleExport = async () => {
    setProcessingExport(true);
    try {
      await exportData();
    } catch (error) {
      console.error(error);
      alert('Failed to export data');
    } finally {
      setProcessingExport(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="relative group overflow-hidden bg-slate-900 dark:bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl shadow-blue-900/20"
      >
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/40">
                <UsersIcon size={20} />
              </div>
              <h3 className="text-xl font-black tracking-tight">Referral Node</h3>
            </div>
            <span className="px-4 py-1.5 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/5">
              Rank {1 + Math.floor((userProfile?.points || 0) / 500)}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Intelligence Rewards</p>
                <PointsBadge 
                  points={userProfile?.points || 0} 
                  className="!bg-transparent !p-0 !shadow-none !border-none !text-2xl font-black" 
                />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Next Level</p>
                <p className="text-xs font-bold text-blue-400">{500 - ((userProfile?.points || 0) % 500)} points needed</p>
              </div>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${((userProfile?.points || 0) % 500) / 5}%` }}
                 className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/50"
               />
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Protocol Identifier</span>
                <span className="font-mono text-lg font-black tracking-widest text-blue-400">{referralCode === '...' ? '---' : referralCode}</span>
              </div>
              {referralCode === 'NO CODE' ? (
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 active:scale-95 transition-all"
                >
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Activate'}
                </button>
              ) : referralCode !== '...' && (
                <div className="flex gap-2">
                  <button onClick={copyCodeOnly} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-white/5"><Copy size={16} /></button>
                  <button onClick={handleShare} className="p-2.5 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-slate-400 hover:text-white border border-white/5"><Share2 size={16} /></button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Decorative glass effect */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl" />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={handleExport}
        className="group relative overflow-hidden bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-2xl hover:border-blue-500/30 transition-all duration-500 cursor-pointer"
      >
        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="space-y-6">
            <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              {processingExport ? <Loader2 size={24} className="animate-spin"/> : <Database size={24} />}
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase mb-2">{t.profile.exportData}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Download your complete encrypted intelligence record in standardized JSON format.</p>
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:gap-3 transition-all">
            Initialize Export <RefreshCw size={12} className={processingExport ? 'animate-spin' : ''} />
          </div>
        </div>
        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:opacity-100 opacity-0 transition-opacity" />
      </motion.div>
    </div>
  );
}
