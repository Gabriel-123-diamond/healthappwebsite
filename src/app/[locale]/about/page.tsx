'use client';

import React from 'react';
import { Shield, Users, Heart, Globe, Award, Sparkles, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('aboutPage');

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Hero */}
      <section className="relative px-4 text-center mb-32">
        <div className="max-w-4xl mx-auto space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100 dark:border-blue-800/50 shadow-sm mx-auto"
          >
            <Activity size={14} className="animate-pulse" />
            {t('badge')}
          </motion.div>
          
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
            {t('titlePart1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{t('titlePart2')}</span> <br className="hidden sm:block" />
            {t('titlePart3')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">{t('titlePart4')}</span>.
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="px-4 mb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">{t('visionTitle')}</h2>
              <div className="h-1 w-20 bg-blue-600 rounded-full" />
            </div>
            
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {t('visionText')}
            </p>
            
            <div className="space-y-6">
              <ValueItem icon={<Shield className="w-5 h-5" />} title={t('value1Title')} text={t('value1Text')} />
              <ValueItem icon={<Globe className="w-5 h-5" />} title={t('value2Title')} text={t('value2Text')} />
              <ValueItem icon={<Users className="w-5 h-5" />} title={t('value3Title')} text={t('value3Text')} />
            </div>
          </div>
          
          <div className="relative">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="aspect-square bg-slate-50 dark:bg-slate-900/50 rounded-[64px] border border-slate-100 dark:border-slate-800 flex items-center justify-center p-12 shadow-3xl shadow-blue-900/5 overflow-hidden"
            >
              <Heart className="w-full h-full text-blue-600/5 dark:text-blue-400/5 absolute inset-0 -translate-x-1/4 -translate-y-1/4" size={400} />
              <div className="relative z-10 text-center space-y-6">
                <Sparkles size={80} className="text-blue-600 dark:text-blue-400 mx-auto animate-spin-slow" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">{t('engineActive')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust & Safety */}
      <section className="px-4">
        <div className="max-w-7xl mx-auto bg-slate-900 dark:bg-blue-600 rounded-[64px] p-12 sm:p-20 text-white shadow-3xl shadow-blue-900/20 relative overflow-hidden group">
          <div className="relative z-10 text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight leading-none uppercase">{t('integrityTitle')}</h2>
            <p className="text-lg font-medium text-white/70">{t('integritySubtitle')}</p>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
            <SecurityCard 
              icon={<Shield size={32} className="text-blue-400 group-hover:text-white" />}
              title={t('security1Title')}
              text={t('security1Text')}
            />
            <SecurityCard 
              icon={<Award size={32} className="text-amber-400 group-hover:text-white" />}
              title={t('security2Title')}
              text={t('security2Text')}
            />
            <SecurityCard 
              icon={<Users size={32} className="text-emerald-400 group-hover:text-white" />}
              title={t('security3Title')}
              text={t('security3Text')}
            />
          </div>
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>
      </section>
    </div>
  );
}

function ValueItem({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="flex items-start gap-5 group">
      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 text-blue-600 dark:text-blue-400">
        {icon}
      </div>
      <div className="space-y-1">
        <h4 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">{title}</h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function SecurityCard({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) {
  return (
    <div className="space-y-6 text-center group/card">
      <div className="w-20 h-20 bg-white/10 rounded-[28px] flex items-center justify-center mx-auto transition-all duration-500 group-hover/card:scale-110 group-hover/card:bg-white/20">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black uppercase tracking-tight">{title}</h3>
        <p className="text-white/60 text-sm font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
