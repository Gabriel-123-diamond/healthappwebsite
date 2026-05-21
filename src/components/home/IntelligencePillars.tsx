import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Video, BookOpen, Calendar } from "lucide-react";
import { BentoCard } from "./HomeComponents";

interface IntelligencePillarsProps {
  t: any;
}

export const IntelligencePillars: React.FC<IntelligencePillarsProps> = ({ t }) => {
  return (
    <div className="relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 sm:mb-24 space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-sm border border-indigo-100/50 dark:border-indigo-800/50">
          Our Foundation
        </div>
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.05]">
          {t('home.featuresTitle')}
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('home.featuresSubtitle')}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(280px,auto)]">
        {/* Feature 1 - Large Span */}
        <BentoCard 
          className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800/50 border-blue-100/50 dark:border-blue-900/20"
          icon={<Shield className="w-8 h-8 text-blue-600" />}
          title={t('home.feature1Title')}
          description={t('home.feature1Desc')}
          delay={0}
        />
        {/* Feature 2 */}
        <BentoCard 
          className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-white/5"
          icon={<Video className="w-8 h-8 text-red-500" />}
          title={t('home.feature2Title')}
          description={t('home.feature2Desc')}
          delay={0.1}
        />
        {/* Feature 3 */}
        <BentoCard 
          className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-white/5"
          icon={<Users className="w-8 h-8 text-emerald-500" />}
          title={t('home.feature3Title')}
          description={t('home.feature3Desc')}
          delay={0.2}
        />
        {/* Feature 4 */}
        <BentoCard 
          className="bg-white dark:bg-slate-900 border-slate-200/50 dark:border-white/5"
          icon={<Calendar className="w-8 h-8 text-amber-500" />}
          title={t('home.feature4Title')}
          description={t('home.feature4Desc')}
          delay={0.3}
        />
        {/* Feature 5 */}
        <BentoCard 
          className="md:col-span-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800/50 border-purple-100/50 dark:border-purple-900/20"
          icon={<BookOpen className="w-8 h-8 text-purple-600" />}
          title={t('home.feature5Title')}
          description={t('home.feature5Desc')}
          delay={0.4}
        />
      </div>
    </div>
  );
};
