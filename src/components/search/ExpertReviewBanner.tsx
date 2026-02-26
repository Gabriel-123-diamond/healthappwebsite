'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck, UserCheck } from 'lucide-react';
import { AIReview } from '@/types';

interface ExpertReviewBannerProps {
  reviews: AIReview[];
}

export const ExpertReviewBanner: React.FC<ExpertReviewBannerProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) return null;

  const topReview = reviews.find(r => r.status === 'flagged') || 
                    reviews.find(r => r.status === 'verified') || 
                    reviews[0];

  const isFlagged = topReview.status === 'flagged';
  const isVerified = topReview.status === 'verified';

  return (
    <div className={`mx-5 sm:mx-8 mb-6 p-4 rounded-2xl border flex flex-col gap-3 ${
      isFlagged ? 'bg-red-50 border-red-100 text-red-900' :
      isVerified ? 'bg-emerald-50 border-emerald-100 text-emerald-900' :
      'bg-blue-50 border-blue-100 text-blue-900'
    }`}>
      <div className="flex items-center gap-2">
        {isFlagged ? <AlertTriangle className="w-5 h-5 text-red-600" /> :
         isVerified ? <ShieldCheck className="w-5 h-5 text-emerald-600" /> :
         <UserCheck className="w-5 h-5 text-blue-600" />}
        <span className="font-bold">
          {isFlagged ? 'Expert Caution' : isVerified ? 'Expert Verified' : 'Expert Note'}
        </span>
      </div>
      
      {topReview.note && (
        <p className="text-sm leading-relaxed opacity-90">{topReview.note}</p>
      )}

      <div className="flex items-center gap-2 mt-1">
        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
          {topReview.expertName[0]}
        </div>
        <span className="text-xs font-bold opacity-70">
          By {topReview.expertName}, {topReview.expertTitle}
        </span>
      </div>
    </div>
  );
};
