'use client';

import React, { useState } from 'react';
import { Users as UsersIcon, Copy, Link as LinkIcon, RefreshCw, Share2, Loader2, Database, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { referralService, REWARD_POINTS } from '@/services/referralService';
import { exportData } from '@/services/dataService';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import NiceModal from '@/components/common/NiceModal';

interface ProfileStatsProps {
  user: User;
  userProfile: UserProfile | null;
  referralCode: string;
  setReferralCode: (code: string) => void;
  t: any; // Kept for legacy if needed, but using hook now
}

export default function ProfileStats({ user, userProfile, referralCode, setReferralCode }: ProfileStatsProps) {
  const t = useTranslations('profile.stats');
  const [generating, setGenerating] = useState(false);
  const [processingExport, setProcessingExport] = useState(false);
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const handleGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const copyCodeOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (referralCode === '...' || referralCode === 'NO CODE') return;
    navigator.clipboard.writeText(referralCode);
    showAlert('Copied!', t('copyCode'), 'success');
  };

  const copyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (referralCode === '...' || referralCode === 'NO CODE') return;
    const link = referralService.getReferralLink(referralCode);
    navigator.clipboard.writeText(link);
    showAlert('Copied!', t('copyLink'), 'success');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
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
      const copyOnlyEvent = { stopPropagation: () => {} } as React.MouseEvent;
      copyLink(copyOnlyEvent);
    }
  };

  const handleExport = async () => {
    setProcessingExport(true);
    try {
      await exportData();
    } catch (error) {
      console.error(error);
      showAlert('Export Failed', 'Failed to export data', 'warning');
    } finally {
      setProcessingExport(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Referral Node Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => router.push('/referrals')}
          className="bg-white dark:bg-[#0B1221] rounded-[32px] p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[320px] cursor-pointer group/referral hover:ring-2 hover:ring-blue-500/30 transition-all border border-slate-100 dark:border-white/5"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 dark:from-blue-600/10 dark:to-indigo-600/10" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
                  <UsersIcon size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-widest uppercase">{t('referralNode')}</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('active')}</p>
                  </div>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl">
                <p className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{t('rank')} {1 + Math.floor((userProfile?.points || 0) / 500)}</p>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums leading-none">
                {userProfile?.points || 0}
              </span>
              <div className="flex flex-col">
                <Zap size={14} className="text-blue-600 dark:text-blue-500 mb-0.5" />
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-widest">{t('points')}</span>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="flex justify-between items-end">
                <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{t('evolution')}</p>
                <span className="text-xs font-black text-slate-900 dark:text-white tabular-nums leading-none">
                  {Math.round(((userProfile?.points || 0) % 500) / 5)}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-white/10">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((userProfile?.points || 0) % 500) / 5}%` }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <code className="text-sm font-black text-slate-900 dark:text-white tracking-[0.2em] font-mono truncate block">
                  {referralCode === '...' ? '---' : referralCode}
              </code>
            </div>
            <div className="flex gap-2">
              {referralCode === 'NO CODE' ? (
                <button 
                  onClick={handleGenerate}
                  disabled={generating}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                >
                  {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : t('initialize')}
                </button>
              ) : referralCode !== '...' && (
                <>
                  <button 
                    onClick={copyCodeOnly}
                    className="p-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all active:scale-95"
                  >
                    <Copy size={14} />
                  </button>
                  <button 
                    onClick={handleShare}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2"
                  >
                    <Share2 size={12} /> {t('share')}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Export Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleExport}
          className="group bg-white dark:bg-[#0B1221] rounded-[32px] p-6 sm:p-8 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all cursor-pointer flex flex-col justify-between min-h-[320px]"
        >
          <div className="space-y-6">
            <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              {processingExport ? <Loader2 size={24} className="animate-spin"/> : <Database size={24} />}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t('dataVault')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                {t('dataVaultDesc')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-between text-[10px] font-black text-blue-600 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            <span>{t('initializeExtraction')}</span>
            <RefreshCw size={14} className={processingExport ? 'animate-spin' : ''} />
          </div>
        </motion.div>
      </div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </>
  );
}
