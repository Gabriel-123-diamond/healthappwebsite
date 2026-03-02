'use client';

import { AlertCircle, RefreshCcw, Sparkles, ArrowRight } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { getFeedItems } from '@/services/feedService';
import { FeedItem } from '@/types';
import { onAuthStateChanged } from 'firebase/auth';
import { FeedCard } from './FeedCard';
import { motion } from 'framer-motion';

export default function FeedSection() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const { t, locale } = useLanguage();

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getFeedItems(locale);
      setItems(data);
    } catch (err: any) {
      console.error("FeedSection load error:", err);
      setError(err.message || "Failed to load feed items");
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedOut(!user);
      loadFeed();
    });
    return () => unsubscribe();
  }, [loadFeed]);

  if (loading) return (
    <div className="py-24 max-w-7xl mx-auto px-4">
      <div className="flex flex-col items-center space-y-8">
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-[480px] bg-slate-100 dark:bg-slate-800/50 rounded-[40px] animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="py-24 px-4 bg-red-50 dark:bg-red-900/5 rounded-[48px] border border-red-100 dark:border-red-900/20 max-w-3xl mx-auto my-12 text-center shadow-2xl shadow-red-500/5">
      <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-8">
        <AlertCircle className="w-10 h-10" />
      </div>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t.common.syncInterrupted}</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg font-medium leading-relaxed">
        {t.common.syncInterruptedSubtitle}
      </p>
      <button 
        onClick={loadFeed}
        className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-slate-200 dark:shadow-none"
      >
        <RefreshCcw className="w-4 h-4" />
        {t.common.retryConnection}
      </button>
    </div>
  );

  return (
    <section className="py-32 bg-white dark:bg-slate-950 transition-colors relative overflow-hidden">
      {/* Dynamic Ambient Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/5 dark:bg-blue-600/5 blur-[140px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/5 dark:bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="space-y-6 text-center md:text-left">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] border border-blue-100/50 dark:border-blue-800/50 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t.common.intelligenceDiscovery}
            </motion.div>
            <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{t.feed.recommended}</h2>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed opacity-80">{t.feed.subtitle}</p>
          </div>
          
          <Link 
            href="/articles" 
            className="group relative inline-flex items-center gap-4 px-10 py-5 rounded-[24px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] transition-all shadow-2xl shadow-slate-900/20 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              {t.common.viewAll}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 sm:gap-10">
            {items.map((item, index) => (
              <FeedCard key={item.id} item={item} index={index} t={t} isBlurred={isLoggedOut} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-slate-50/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[64px]">
             <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
               <RefreshCcw className="w-8 h-8 text-slate-200 animate-spin-slow" />
             </div>
             <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs">{t.common.noActiveInsights}</p>
             <button onClick={loadFeed} className="mt-8 text-blue-600 font-black uppercase tracking-widest text-[10px] hover:underline decoration-2 underline-offset-8">{t.common.reSyncFeed}</button>
          </div>
        )}
      </div>
    </section>
  );
}
