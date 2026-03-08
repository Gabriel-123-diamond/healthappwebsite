'use client';

import React, { useState } from 'react';
import { Share2, ChevronLeft, Trophy, Users, Sparkles } from 'lucide-react';
import { useReferralData } from '@/hooks/useReferralData';
import ReferralCodeCard from '@/components/referrals/ReferralCodeCard';
import ReferralTrackerList from '@/components/referrals/ReferralTrackerList';
import ReferralDateFilter from '@/components/referrals/ReferralDateFilter';
import ReferralLoggedOutCTA from '@/components/referrals/ReferralLoggedOutCTA';
import HowItWorks from '@/components/referrals/HowItWorks';
import PointsBadge from '@/components/common/PointsBadge';
import { referralService, REWARD_POINTS } from '@/services/referralService';
import { useRouter } from '@/i18n/routing';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function ReferralsPage() {
  const router = useRouter();
  const t = useTranslations('referralsPage');
  const [showRankDetails, setShowRankDetails] = useState(false);

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/profile');
    }
  };

  const {
    codes,
    loadingCodes,
    generating,
    referrals,
    loadingReferrals,
    referralPoints,
    filteredPoints,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    pointsFilter,
    setPointsFilter,
    handleGenerate,
    handleDelete,
    copyToClipboard,
    copyLinkToClipboard,
    user
  } = useReferralData();

  const rankTiers = [
    { rank: 1, name: t('tiers.0.name'), range: "0 - 499 PTS", desc: t('tiers.0.desc') },
    { rank: 2, name: t('tiers.1.name'), range: "500 - 999 PTS", desc: t('tiers.1.desc') },
    { rank: 3, name: t('tiers.2.name'), range: "1,000 - 1,499 PTS", desc: t('tiers.2.desc') },
    { rank: 4, name: t('tiers.3.name'), range: "1,500 - 1,999 PTS", desc: t('tiers.3.desc') },
    { rank: 5, name: t('tiers.4.name'), range: "2,000+ PTS", desc: t('tiers.4.desc') },
  ];

  const currentRank = 1 + Math.floor((referralPoints || 0) / 500);

  const handleShare = async (sharedCode: string) => {
    const link = referralService.getReferralLink(sharedCode);
    const shareData = {
      title: 'Join me on Ikiké Health AI',
      text: `Join me on Ikiké Health AI and let's discover holistic health together! Use my referral code: ${sharedCode} to get ${REWARD_POINTS} bonus points.`,
      url: link,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyLinkToClipboard(sharedCode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        {!user ? (
          <ReferralLoggedOutCTA />
        ) : (
          <div className="space-y-10">
            <div className="bg-white dark:bg-[#0B1221] rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-white/5 p-8 sm:p-12 md:p-16 text-center relative overflow-hidden group transition-colors">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />
              
              <button 
                onClick={handleBack}
                className="absolute top-8 left-8 p-3 bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all shadow-sm group/back border border-transparent dark:border-white/5 z-20"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div className="relative mb-10">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-600 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 relative z-10"
                >
                  <Share2 className="w-10 h-10 sm:w-14 sm:h-14" strokeWidth={2} />
                </motion.div>
                <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">{t('title')}</h1>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-lg mx-auto font-medium leading-relaxed opacity-80">
                {t('subtitle', { points: REWARD_POINTS })}
              </p>

              <div className="flex justify-center mb-12">
                <PointsBadge points={referralPoints} label="Total Acquisition Credits" className="px-10 py-4 !rounded-[24px] !bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 shadow-2xl transition-colors" />
              </div>

              {/* Rank & Evolution Section */}
              <div className="max-w-md mx-auto mb-12 space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500 rounded-lg text-white shadow-lg shadow-amber-500/20">
                      <Trophy size={16} strokeWidth={3} />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('networkAuthority')}</p>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('rank')} {currentRank}</h3>
                        <button 
                          onClick={() => setShowRankDetails(true)}
                          className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                        >
                          <Sparkles size={10} /> {t('viewTiers')}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">{t('ptsToEvolve', { pts: 500 - ((referralPoints || 0) % 500) })}</p>
                    <div className="flex items-center justify-end gap-1">
                      <Sparkles size={12} className="text-amber-500 animate-pulse" />
                      <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t('level')} {currentRank}</span>
                    </div>
                  </div>
                </div>

                <div className="relative h-4 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden p-1 border border-slate-200/50 dark:border-white/10 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((referralPoints || 0) % 500) / 5}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 rounded-full relative"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                  </motion.div>
                </div>
                
                <div className="flex justify-between items-center px-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('currentMilestone')}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('nextEvolution')}</span>
                </div>
              </div>
              
              <ReferralCodeCard 
                codes={codes}
                loading={loadingCodes}
                generating={generating}
                onGenerate={handleGenerate}
                onDelete={handleDelete}
                onCopy={copyToClipboard}
                onCopyLink={copyLinkToClipboard}
                onShare={handleShare}
              />

              <div className="mt-16 pt-16 border-t border-slate-50 dark:border-slate-800/50">
                <HowItWorks />
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 px-2">
                <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600">
                  <Users size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{t('networkTracker')}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{t('trackerSubtitle')}</p>
                </div>
              </div>

              <ReferralDateFilter
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                pointsFilter={pointsFilter}
                setPointsFilter={setPointsFilter}
                filteredPoints={filteredPoints}
              />
              
              <ReferralTrackerList 
                referrals={referrals}
                loading={loadingReferrals}
              />
            </div>
          </div>
        )}
      </div>

      {/* Rank Details Modal */}
      <AnimatePresence>
        {showRankDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRankDetails(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-[#0B1221] rounded-[40px] shadow-3xl border border-slate-100 dark:border-white/5 overflow-hidden"
            >
              <div className="p-8 sm:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('authorityTiers')}</h2>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{t('evolutionPath')}</p>
                  </div>
                  <button 
                    onClick={() => setShowRankDetails(false)}
                    className="p-3 bg-slate-50 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 rounded-2xl transition-all"
                  >
                    <ChevronLeft className="rotate-180" size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {rankTiers.map((tier) => (
                    <div 
                      key={tier.rank}
                      className={`p-5 rounded-3xl border transition-all ${
                        currentRank === tier.rank 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/30 ring-4 ring-blue-500/5' 
                          : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                            currentRank === tier.rank ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {tier.rank}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{tier.name}</h4>
                            <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{tier.range}</p>
                          </div>
                        </div>
                        {currentRank === tier.rank && (
                          <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-sm">
                            {t('active')}
                          </div>
                        )}
                      </div>
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                        {tier.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
