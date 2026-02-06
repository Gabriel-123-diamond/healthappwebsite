'use client';

import React from 'react';
import { Share2, ArrowLeft, Trophy } from 'lucide-react';
import { useReferralData } from '@/hooks/useReferralData';
import ReferralCodeCard from '@/components/referrals/ReferralCodeCard';
import ReferralTrackerList from '@/components/referrals/ReferralTrackerList';
import ReferralDateFilter from '@/components/referrals/ReferralDateFilter';
import ReferralLoggedOutCTA from '@/components/referrals/ReferralLoggedOutCTA';
import HowItWorks from '@/components/referrals/HowItWorks';
import PointsBadge from '@/components/common/PointsBadge';
import { referralService, REWARD_POINTS } from '@/services/referralService';
import { useRouter } from '@/i18n/routing';

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
    <div className="min-h-screen bg-slate-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        
        {!user ? (
          <ReferralLoggedOutCTA />
        ) : (
          <>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 text-center border border-slate-100 relative overflow-hidden">
              {/* Internal Back Button */}
              <button 
                onClick={() => router.back()}
                className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 sm:p-3 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl sm:rounded-2xl transition-all border border-transparent hover:border-blue-100 group"
                title="Go Back"
              >
                <ArrowLeft size={18} className="sm:w-5 sm:h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <Share2 className="w-8 h-8 sm:w-12 sm:h-12" strokeWidth={1.5} />
              </div>
              
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-3 sm:mb-4 tracking-tight">Invite & Earn</h1>
              <p className="text-slate-500 mb-6 sm:mb-8 text-sm sm:text-lg font-medium max-w-lg mx-auto leading-relaxed">
                Invite your friends to join HealthAI. You'll both earn <span className="font-bold text-blue-600">{REWARD_POINTS} Health Points</span> when they sign up using your code!
              </p>

              <div className="mb-8 sm:mb-10">
                <PointsBadge points={referralPoints} label="Total Rewards Earned" className="scale-90 sm:scale-100" />
              </div>
              
              <ReferralCodeCard 
                code={code}
                generating={generating}
                onGenerate={handleGenerate}
                onCopy={copyToClipboard}
                onCopyLink={copyLinkToClipboard}
                onShare={handleShare}
              />

              <div className="mt-8 sm:mt-12">
                <HowItWorks />
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
          </>
        )}
      </div>
    </div>
  );
}