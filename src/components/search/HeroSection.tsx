import React from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  t: any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ t }) => {
  return (
    <motion.div
      key="hero"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center mb-20"
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div 
        whileHover={{ scale: 1.05, y: -2 }}
        className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] mb-10 border border-slate-100 dark:border-slate-800 cursor-default shadow-xl shadow-blue-500/5"
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
        {t('home.heroTag')}
      </motion.div>
      <h1 className="text-6xl sm:text-7xl md:text-[100px] font-black text-slate-900 dark:text-white mb-10 tracking-tighter leading-[0.85] filter drop-shadow-sm">
        {t('home.heroTitle')} <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] animate-gradient-x">{t('home.heroTitleSpan')}</span>
      </h1>
      <p className="text-xl sm:text-2xl text-slate-500 dark:text-slate-400 mb-16 max-w-3xl mx-auto px-4 font-medium leading-relaxed opacity-80">
        {t('home.heroSubtitle')}
      </p>
    </motion.div>
  );
};
