'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Beaker, FlaskConical, Zap, ChevronRight, ArrowLeft, 
  Loader2, Lock, Sparkles, ShieldCheck, Microscope
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types/user';
import { checkFeatureFlag } from '@/lib/featureFlags';

export default function BetaNodesPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isElite, setIsElite] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const userProfile = await userService.getUserProfile(user.uid);
        setProfile(userProfile);
        if (userProfile) {
          const hasAccess = await checkFeatureFlag('beta_access', userProfile.tier || 'basic', userProfile.role || 'user');
          setIsElite(hasAccess);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isElite) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-[28px] flex items-center justify-center text-purple-600 mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
            Early <span className="text-purple-600">Access.</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
            Early access to new features is an ELITE member benefit. Join the front-line of health innovation.
          </p>
          <Link href="/upgrade" className="inline-flex items-center gap-3 px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all">
            UPGRADE TO ELITE <Zap size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <header className="mb-16">
          <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-600/20">
              <Beaker size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Early <span className="text-purple-600">Access.</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mt-4">
            Test the next generation of health tools before they are released to everyone.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BetaNodeCard 
            title="DNA Insights"
            description="Learn about your health based on DNA markers and mapping. (Alpha 0.4)"
            icon={<FlaskConical size={24} />}
            status="testing"
          />
          <BetaNodeCard 
            title="Gut Health Map"
            description="Analyze gut-health data from metabolic markers. (Alpha 0.2)"
            icon={<Microscope size={24} />}
            status="upcoming"
          />
        </div>
      </div>
    </div>
  );
}

function BetaNodeCard({ title, description, icon, status }: { title: string, description: string, icon: React.ReactNode, status: 'testing' | 'upcoming' }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 relative overflow-hidden group hover:border-purple-500/30 transition-all">
      <div className="absolute top-0 right-0 p-6">
        <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${
          status === 'testing' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
        }`}>
          {status === 'testing' ? 'Active' : 'Coming Soon'}
        </span>
      </div>
      
      <div className="w-14 h-14 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-purple-600 mb-8">
        {icon}
      </div>
      
      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8">{description}</p>
      
      <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-600 group-hover:gap-4 transition-all">
        Open Feature <ChevronRight size={14} />
      </button>
    </div>
  );
}
