'use client';

import React from 'react';
import { Users, Clock, CheckCircle2, RefreshCw, LogIn } from 'lucide-react';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { Referral } from '@/types/referral';
import { REWARD_POINTS } from '@/services/referralService';

interface ReferralTrackerListProps {
  referrals: Referral[];
  loading: boolean;
}

export default function ReferralTrackerList({ referrals, loading }: ReferralTrackerListProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 border border-slate-100">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Your Referrals</h2>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
          <Users size={20} className="sm:w-6 sm:h-6" strokeWidth={2} />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : referrals.length > 0 ? (
        <div className="space-y-4">
          {referrals.map((ref) => (
            <div 
              key={ref.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 rounded-2xl border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-md transition-all group gap-4"
            >
              <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                <div className={`p-3 rounded-2xl shrink-0 transition-colors ${
                  ref.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                }`}>
                  {ref.status === 'completed' ? <CheckCircle2 size={20} className="sm:w-6 sm:h-6" /> : <Clock size={20} className="sm:w-6 sm:h-6" />}
                </div>
                <div className="min-w-0">
                  <p className="font-black text-slate-900 truncate" title={ref.inviteeEmail || 'Unknown User'}>
                    {ref.inviteeEmail || 'Unknown User'}
                  </p>
                  <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                    ref.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'
                  }`}>
                    {ref.status === 'completed' ? 'Profile Completed' : 'Profile Pending'}
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 flex sm:block items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest sm:hidden">Points</p>
                <p className={`text-lg font-black ${
                  ref.status === 'completed' ? 'text-emerald-600' : 'text-slate-400'
                }`}>
                  {ref.status === 'completed' ? `+${REWARD_POINTS} PTS` : 'WAITING'}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 bg-slate-50 rounded-2xl sm:rounded-[32px] border border-dashed border-slate-200">
          <div className="p-4 bg-white rounded-2xl w-fit mx-auto mb-4 shadow-sm">
            <Users size={32} className="text-slate-300" />
          </div>
          <p className="text-slate-400 font-bold">No referrals yet</p>
          <p className="text-xs text-slate-400 mt-1">Share your code to start tracking!</p>
        </div>
      )}
    </div>
  );
}
