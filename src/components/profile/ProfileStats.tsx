'use client';

import React, { useState } from 'react';
import { Users as UsersIcon, Copy, Link as LinkIcon, RefreshCw, Share2, Download, Loader2, Settings } from 'lucide-react';
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
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white hover:scale-[1.02] transition-transform cursor-pointer"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <UsersIcon className="w-5 h-5 text-white" />
          </div>
          <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
            Level {1 + Math.floor((userProfile?.points || 0) / 500)}
          </span>
        </div>
        
        <div className="mb-6">
          <p className="text-indigo-100 text-sm mb-2">Earn rewards by inviting friends.</p>
          <PointsBadge 
            points={userProfile?.points || 0} 
            className="!bg-white/10 !shadow-none border border-white/10" 
          />
        </div>
        
        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-indigo-200 uppercase tracking-wider font-bold">Your Code</p>
            <p className="font-mono font-bold tracking-widest">{referralCode === '...' ? '---' : referralCode}</p>
          </div>
          <div className="flex gap-2">
            {referralCode === 'NO CODE' ? (
              <button 
                onClick={handleGenerate}
                disabled={generating}
                className="p-2 bg-white text-indigo-600 rounded-lg font-bold text-xs hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                {generating ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Generate'}
              </button>
            ) : referralCode !== '...' && (
              <>
                <button 
                  onClick={copyCodeOnly}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy Code"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button 
                  onClick={copyLink}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Copy Link"
                >
                  <LinkIcon className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
        {referralCode !== '...' && referralCode !== 'NO CODE' && (
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={copyLink}
              className="py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <LinkIcon className="w-3 h-3" />
              Copy Link
            </button>
            <button 
              onClick={handleShare}
              className="py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-bold transition-all border border-white/10 flex items-center justify-center gap-2"
            >
              <Share2 className="w-3 h-3" />
              Share Now
            </button>
          </div>
        )}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        onClick={handleExport}
        className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group"
      >
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
          {processingExport ? <Loader2 className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5" />}
        </div>
        <h3 className="font-bold text-slate-900 mb-1">{t.profile.exportData}</h3>
        <p className="text-sm text-slate-500">Download a copy of your health data.</p>
      </motion.div>
    </div>
  );
}
