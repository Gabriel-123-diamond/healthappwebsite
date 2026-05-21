'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types/user';
import HealthInsightsNode from './dashboard/HealthInsightsNode';
import { motion } from 'framer-motion';
import { Activity, BarChart3, ShieldCheck, MessageCircle, ChevronRight, Zap } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { intelligenceService } from '@/services/intelligenceService';
import { AiCompanionWidget } from './dashboard/AiCompanionWidget';
import { WellnessTrackerWidget } from './dashboard/WellnessTrackerWidget';
import { FamilyVaultWidget } from './dashboard/FamilyVaultWidget';

export default function HomeIntelligenceSection() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userProfile = await userService.getUserProfile(user.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error("Failed to fetch profile for intelligence section:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading || !profile) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
      <div className="md:col-span-2 lg:col-span-2">
        <AiCompanionWidget />
      </div>
      <div className="md:col-span-1 lg:col-span-1">
        <WellnessTrackerWidget />
      </div>
      <div className="md:col-span-1 lg:col-span-1">
        <FamilyVaultWidget />
      </div>
      <div className="md:col-span-2 lg:col-span-4">
        <HealthInsightsNode tier={profile.tier} />
      </div>
    </div>
  );
}

function HealthTrendsMiniNode({ tier }: { tier?: string }) {
  const [trends, setTrends] = useState<any>(null);
  const isPremium = tier === 'vip1' || tier === 'vip2' || tier === 'premium';
  
  useEffect(() => {
    if (isPremium) {
      intelligenceService.getHealthTrends().then(setTrends).catch(console.error);
    }
  }, [isPremium]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600">
          <Activity size={18} />
        </div>
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Clinical Trends</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
        {!isPremium ? (
          <>
            <div className="w-12 h-12 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center text-slate-300">
              <BarChart3 size={20} />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
              Upgrade to ELITE to visualize your personal clinical history.
            </p>
            <Link 
              href="/upgrade" 
              className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center gap-2"
            >
              Upgrade Node <Zap size={12} />
            </Link>
          </>
        ) : (
          <div className="w-full space-y-6">
            <div className="h-24 flex items-end gap-2 px-4">
              {(trends?.searchFrequency || [0,0,0,0,0,0,0]).map((count: number, i: number) => {
                const max = Math.max(...(trends?.searchFrequency || [1]));
                const height = max > 0 ? (count / max) * 100 : 5;
                return (
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    className="flex-1 bg-indigo-500/20 rounded-t-lg border-t-2 border-indigo-500"
                  />
                );
              })}
            </div>
            <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">
              7-Day Intelligence Wave
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityMiniNode() {
  return (
    <Link href="/community" className="bg-white dark:bg-slate-900 rounded-[32px] p-8 border border-slate-100 dark:border-white/5 shadow-sm hover:border-blue-500/30 transition-all group block text-left">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
            <MessageCircle size={18} />
          </div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Community</h3>
        </div>
        <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
      </div>
      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
        Join global health discussions and share evidence-based experiences with other nodes.
      </p>
    </Link>
  );
}

function SecuritySpecsMiniNode() {
  return (
    <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full" />
      <div className="relative z-10 flex items-center gap-4">
        <div className="p-3 bg-white/10 rounded-2xl">
          <ShieldCheck size={20} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Privacy Standard</p>
          <p className="text-xs font-bold">AES-256 Protocol Active</p>
        </div>
      </div>
    </div>
  );
}
