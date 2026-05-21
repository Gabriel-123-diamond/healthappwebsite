'use client';

import React from 'react';
import SearchSection from "@/components/SearchSection";
import HomeIntelligenceSection from "@/components/HomeIntelligenceSection";
import FeedSection from "@/components/FeedSection";
import SymptomWizard from "@/components/discovery/SymptomWizard";
import { Shield, Users, Video, BookOpen, Calendar, ArrowRight, CheckCircle2, Star, Sparkles, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { BentoCard, StatMetric } from "@/components/home/HomeComponents";
import { IntelligencePillars } from "@/components/home/IntelligencePillars";
import { GlobalRegistryCTA } from "@/components/home/GlobalRegistryCTA";
import AuthCheckWrapper from "@/components/common/AuthCheckWrapper";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="relative bg-slate-50 dark:bg-[#0B1221] transition-colors min-h-screen overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] rounded-full -translate-x-1/3 translate-y-1/3" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.015] dark:opacity-[0.03] mix-blend-overlay" />
      </div>
      
      <div className="relative z-10 flex flex-col">
        {/* Hero & Search */}
        <section className="w-full">
          <SearchSection />
        </section>

        {/* Intelligence Hub: Command Center & Pillars Grouped */}
        <section className="relative w-full py-8 sm:py-16 overflow-hidden">
          {/* Subtle Section Divider Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-200/40 to-transparent dark:via-blue-900/10 pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-24">
            
            {/* Unified Command Center */}
            <div className="flex flex-col gap-16">
              {/* Symptom Wizard - Now Centered and Primary */}
              <div className="max-w-4xl mx-auto w-full">
                <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 rounded-[40px] p-6 sm:p-10 shadow-2xl shadow-blue-900/5 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-700 flex flex-col">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-700">
                    <Sparkles className="w-32 h-32 text-blue-600" />
                  </div>
                  <div className="mb-8 relative z-10 shrink-0 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-[0.2em] shadow-sm mb-3">
                      {t('home.symptomDiscovery')}
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                      {t('home.guidedDiscoveryTitle')}
                    </h2>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium mt-4 max-w-2xl mx-auto">
                      {t('home.guidedDiscoveryDesc')}
                    </p>
                  </div>
                  <div className="relative z-10 w-full">
                    <SymptomWizard />
                  </div>
                </div>

                {/* Quick Shortcuts - Added for completeness */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                  {[
                    { label: t('common.directory'), icon: <Users size={16} />, href: '/directory' },
                    { label: t('common.community'), icon: <MessageCircle size={16} />, href: '/community' },
                    { label: t('common.learn'), icon: <BookOpen size={16} />, href: '/learning' },
                    { label: t('common.chat'), icon: <Sparkles size={16} />, href: '/chat' },
                  ].map((item, i) => (
                    <Link key={i} href={item.href} className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200/50 dark:border-white/5 hover:border-blue-500/30 transition-all group shadow-sm">
                      <span className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Health Summary / Personal Intelligence - Secondary Row */}
              <div className="w-full">
                <HomeIntelligenceSection />
                
                {/* Fallback for Public Users */}
                <AuthCheckWrapper fallback={
                  <div className="bg-slate-900 rounded-[48px] p-8 sm:p-12 text-white relative overflow-hidden border border-white/10 shadow-2xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full -mr-48 -mt-48" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                      <div className="space-y-4 max-w-xl">
                        <h3 className="text-3xl font-black tracking-tight">{t('profile.header.clinicalIdentity')}</h3>
                        <p className="text-slate-400 font-medium">
                          {t('auth.signInSubtitle')}
                        </p>
                      </div>
                      <Link href="/auth/signin" className="px-8 py-4 bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                        {t('common.getStarted')}
                      </Link>
                    </div>
                  </div>
                } />
              </div>
            </div>
            {/* Intelligence Pillars - Bento Grid Style */}
            <IntelligencePillars t={t} />
          </div>
        </section>

        {/* Global Registry CTA - Modernized */}
        <GlobalRegistryCTA t={t} />
        
        {/* Health Updates Feed */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-[64px] overflow-hidden border border-slate-200/60 dark:border-white/5 shadow-2xl bg-white/50 dark:bg-slate-900/30 backdrop-blur-3xl group/feed hover:border-blue-500/30 transition-all duration-1000">
              <FeedSection />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

