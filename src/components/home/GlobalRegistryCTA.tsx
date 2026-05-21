import React from 'react';
import { motion } from 'framer-motion';
import { Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { StatMetric } from "./HomeComponents";

interface GlobalRegistryCTAProps {
  t: any;
}

export const GlobalRegistryCTA: React.FC<GlobalRegistryCTAProps> = ({ t }) => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 dark:bg-[#0B1221] rounded-[64px] p-8 sm:p-16 lg:p-24 text-white shadow-3xl relative overflow-hidden border border-slate-800 dark:border-white/10 group">
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-transparent to-indigo-600/30 opacity-40 group-hover:opacity-70 transition-opacity duration-1000" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 space-y-10"
            >
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-black uppercase tracking-widest border border-white/10 backdrop-blur-md">
                  <Star className="w-3 h-3 text-amber-400 fill-current" /> {t('home.networkGrowth')}
                </div>
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05]">
                  {t('home.ctaTitle')}
                </h2>
                <p className="text-xl font-medium text-slate-400 leading-relaxed max-w-lg">
                  {t('home.ctaSubtitle')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/directory" className="group/btn relative inline-flex justify-center items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-900 font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-xl active:scale-95">
                  {t('home.ctaButton')}
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link href="/expert/register" className="inline-flex justify-center items-center gap-3 px-8 py-4 rounded-2xl bg-white/5 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all border border-white/10 active:scale-95 backdrop-blur-md">
                  {t('home.ctaRegister')}
                </Link>
              </div>

              <div className="pt-6 flex items-center gap-4 text-sm font-medium text-slate-400">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                  ))}
                </div>
                <p>{t('home.joinVerified')}</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:w-1/2 grid grid-cols-2 gap-4 sm:gap-6 w-full"
            >
              <StatMetric value="500+" label={t('home.statDoctors')} delay={0} color="text-blue-400" />
              <StatMetric value="200+" label={t('home.statHerbal')} delay={0.1} color="text-emerald-400" />
              <StatMetric value="100+" label={t('home.statCenters')} delay={0.2} color="text-purple-400" />
              <StatMetric value="50k+" label={t('home.statRecords')} delay={0.3} color="text-amber-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
