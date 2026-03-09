'use client';

import React, { useState } from 'react';
import { Share2, ChevronLeft } from 'lucide-react';
import { useReferralData } from '@/hooks/useReferralData';
import ReferralCodeCard from '@/components/referrals/ReferralCodeCard';
import ReferralTrackerList from '@/components/referrals/ReferralTrackerList';
import ReferralDateFilter from '@/components/referrals/ReferralDateFilter';
import ReferralLoggedOutCTA from '@/components/referrals/ReferralLoggedOutCTA';
import HowItWorks from '@/components/referrals/HowItWorks';
import PointsBadge from '@/components/common/PointsBadge';
import { referralService, REWARD_POINTS } from '@/services/referralService';
import { useRouter } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RankEvolution } from '@/components/referrals/RankEvolution';
import { RankDetailsModal } from '@/components/referrals/RankDetailsModal';

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

              <RankEvolution 
                t={t}
                referralPoints={referralPoints || 0}
                currentRank={currentRank}
                setShowRankDetails={setShowRankDetails}
              />
              
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

      <RankDetailsModal 
        showRankDetails={showRankDetails}
        setShowRankDetails={setShowRankDetails}
        t={t}
        rankTiers={rankTiers}
        currentRank={currentRank}
      />
    </div>
  );
}
