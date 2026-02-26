'use client';

import React from 'react';
import SearchSection from "@/components/SearchSection";
import FeedSection from "@/components/FeedSection";
import { Shield, Users, Video, BookOpen, Calendar, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-950 transition-colors">
      {/* Dynamic Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10">
        <SearchSection />
        
        <FeedSection />

        {/* Intelligence Pillars */}
        <section className="py-32 px-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-slate-100 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="text-center mb-24 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 dark:border-blue-800/50 shadow-sm mx-auto">
                Foundational Integrity
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{t('home.featuresTitle')}</h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
                {t('home.featuresSubtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 sm:gap-10">
              <FeatureCard 
                icon={<Shield />}
                title={t('home.feature1Title')}
                description={t('home.feature1Desc')}
                delay={0}
                color="text-blue-600"
              />
              <FeatureCard 
                icon={<Video />}
                title={t('home.feature2Title')}
                description={t('home.feature2Desc')}
                delay={0.1}
                color="text-red-600"
              />
              <FeatureCard 
                icon={<Users />}
                title={t('home.feature3Title')}
                description={t('home.feature3Desc')}
                delay={0.2}
                color="text-emerald-600"
              />
              <FeatureCard 
                icon={<Calendar />}
                title={t('home.feature4Title')}
                description={t('home.feature4Desc')}
                delay={0.3}
                color="text-amber-600"
              />
              <FeatureCard 
                icon={<BookOpen />}
                title={t('home.feature5Title')}
                description={t('home.feature5Desc')}
                delay={0.4}
                color="text-purple-600"
              />
            </div>
          </div>
        </section>

        {/* Global Registry CTA */}
        <section className="py-32 px-4">
          <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-blue-600 rounded-[64px] p-12 sm:p-20 text-white shadow-3xl shadow-blue-900/20 relative overflow-hidden group">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10">
                    Network Expansion
                  </div>
                  <h2 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[0.95] uppercase">
                    {t('home.ctaTitle')}
                  </h2>
                  <p className="text-xl font-medium text-white/70 max-w-md leading-relaxed">
                    {t('home.ctaSubtitle')}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-6">
                  <Link href="/directory" className="group/btn relative inline-flex items-center gap-4 px-10 py-5 rounded-[24px] bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-2xl active:scale-95 overflow-hidden">
                    <span className="relative z-10 flex items-center gap-3">
                      {t('home.ctaButton')}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </Link>
                  <Link href="/expert/register" className="inline-flex items-center gap-4 px-10 py-5 rounded-[24px] bg-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/20 transition-all border border-white/20 active:scale-95">
                    {t('home.ctaRegister')}
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false }}
                className="grid grid-cols-2 gap-6 relative"
              >
                <StatMetric value="500+" label="Verified Doctors" color="text-blue-400" />
                <StatMetric value="200+" label="Herbal Practitioners" color="text-emerald-400" />
                <StatMetric value="100+" label="Clinical Centers" color="text-purple-400" />
                <StatMetric value="50k+" label="Monthly Records" color="text-amber-400" />
                
                {/* Center glow */}
                <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 pointer-events-none" />
              </motion.div>
            </div>
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay, color }: { icon: React.ReactNode, title: string, description: string, delay: number, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -12 }}
      className="relative p-8 rounded-[40px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-500 group shadow-sm hover:shadow-2xl"
    >
      <div className="relative z-10 h-full flex flex-col">
        <div className={`w-16 h-16 rounded-[24px] bg-slate-50 dark:bg-slate-800 shadow-inner flex items-center justify-center mb-10 group-hover:scale-110 group-hover:bg-slate-900 dark:group-hover:bg-white transition-all duration-500 ${color}`}>
          {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-7 h-7 group-hover:text-white dark:group-hover:text-slate-900 transition-colors duration-500' })}
        </div>
        <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-4 tracking-tighter leading-tight">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium opacity-80 group-hover:opacity-100 transition-opacity flex-1">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[40px]" />
    </motion.div>
  );
}

function StatMetric({ value, label, color }: { value: string, label: string, color: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-8 rounded-[32px] border border-white/10 text-center space-y-2 hover:bg-white/10 transition-colors group">
      <div className={`text-4xl font-black tracking-tighter transition-transform duration-500 group-hover:scale-110 ${color}`}>{value}</div>
      <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">{label}</div>
    </div>
  );
}


