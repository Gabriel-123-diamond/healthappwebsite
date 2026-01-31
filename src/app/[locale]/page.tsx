'use client';

import SearchSection from "@/components/SearchSection";
import FeedSection from "@/components/FeedSection";
import { Shield, Users, Video, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return (
    <div>
      <SearchSection />
      
      <FeedSection />

      {/* Features Section */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{t('home.featuresTitle')}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {t('home.featuresSubtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-blue-600" />}
              title={t('home.feature1Title')}
              description={t('home.feature1Desc')}
              delay={0}
            />
            <FeatureCard 
              icon={<Video className="w-6 h-6 text-red-600" />}
              title={t('home.feature2Title')}
              description={t('home.feature2Desc')}
              delay={0.1}
            />
            <FeatureCard 
              icon={<Users className="w-6 h-6 text-emerald-600" />}
              title={t('home.feature3Title')}
              description={t('home.feature3Desc')}
              delay={0.2}
            />
            <FeatureCard 
              icon={<Calendar className="w-6 h-6 text-amber-600" />}
              title={t('home.feature4Title')}
              description={t('home.feature4Desc')}
              delay={0.3}
            />
            <FeatureCard 
              icon={<BookOpen className="w-6 h-6 text-purple-600" />}
              title={t('home.feature5Title')}
              description={t('home.feature5Desc')}
              delay={0.4}
            />
          </div>
        </div>
      </section>

      {/* Directory CTA */}
      <section className="py-20 px-4 bg-slate-900 dark:bg-black text-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {t('home.ctaTitle')}
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              {t('home.ctaSubtitle')}
            </p>
            <div className="flex gap-4">
              <Link href="/directory" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                {t('home.ctaButton')}
              </Link>
              <Link href="/expert/register" className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition-colors border border-white/20">
                {t('home.ctaRegister')}
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 grid grid-cols-2 gap-4"
          >
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-sm text-slate-400">Verified Doctors</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">200+</div>
              <div className="text-sm text-slate-400">Herbal Specialists</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">100+</div>
              <div className="text-sm text-slate-400">Hospitals</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
              <div className="text-3xl font-bold text-amber-400 mb-2">50k+</div>
              <div className="text-sm text-slate-400">Monthly Users</div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -10, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-white dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-800/80 dark:hover:border-blue-500 transition-colors group"
    >
      <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}
