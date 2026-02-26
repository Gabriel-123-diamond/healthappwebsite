'use client';

import React from 'react';
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

export default function ReferralsPage() {
  const router = useRouter();
  const {
    code,
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
    copyToClipboard,
    copyLinkToClipboard,
    user
  } = useReferralData();

  const handleShare = async () => {
    if (code === 'LOADING...' || code === 'NO CODE' || code === 'LOGIN REQUIRED') return;
    const link = referralService.getReferralLink(code);
    const shareData = {
      title: 'Join me on Ikiké Health AI',
      text: `Join me on Ikiké Health AI and let's discover holistic health together! Use my referral code: ${code} to get ${REWARD_POINTS} bonus points.`,
      url: link,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      copyLinkToClipboard();
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
            <div className="bg-white dark:bg-slate-900 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 p-8 sm:p-12 md:p-16 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-blue-500/5 to-transparent pointer-events-none" />
              
              <Link href="/profile" className="absolute top-8 left-8 p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-all shadow-sm group/back">
                <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
              </Link>

              <div className="relative mb-10">
                <motion.div 
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  className="w-20 h-20 sm:w-28 sm:h-28 bg-blue-600 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/30 relative z-10"
                >
                  <Share2 className="w-10 h-10 sm:w-14 sm:h-14" strokeWidth={2} />
                </motion.div>
                <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">Intelligence Node</h1>
              <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-lg mx-auto font-medium leading-relaxed opacity-80">
                Expand the network grid. Earn <span className="text-blue-600 dark:text-blue-400 font-black">{REWARD_POINTS} credits</span> for every verified peer acquisition.
              </p>

              <div className="flex justify-center mb-12">
                <PointsBadge points={referralPoints} label="Total Acquisition Credits" className="px-10 py-4 !rounded-[24px] !bg-slate-900 dark:!bg-white !text-white dark:!text-slate-900 shadow-2xl" />
              </div>
              
              <ReferralCodeCard 
                code={code}
                generating={generating}
                onGenerate={handleGenerate}
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
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Network Tracker</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Real-time Acquisition History</p>
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
    </div>
  );
}