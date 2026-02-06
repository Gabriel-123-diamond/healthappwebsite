'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { getFeedItems, FeedItem } from '@/services/feedService';
import { PlayCircle, FileText, CheckCircle, ExternalLink, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';

export default function FeedSection() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, locale } = useLanguage();

  const loadFeed = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ensure we have at least an anonymous session for Firestore rules that might require auth
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (authErr) {
          console.warn("Anonymous auth failed, attempting to load feed anyway:", authErr);
        }
      }
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
    // Wait for auth to initialize or just try to load
    const unsubscribe = onAuthStateChanged(auth, () => {
      loadFeed();
    });
    return () => unsubscribe();
  }, [loadFeed]);

  if (loading) return (
    <div className="py-12 flex justify-center">
      <div className="animate-pulse flex flex-col items-center space-y-4">
        <div className="flex space-x-4">
          <div className="h-12 w-12 bg-slate-200 rounded-full"></div>
          <div className="space-y-4 py-1">
            <div className="h-4 bg-slate-200 rounded w-36"></div>
            <div className="h-4 bg-slate-200 rounded w-24"></div>
          </div>
        </div>
        <p className="text-slate-400 text-sm font-medium animate-bounce">Fetching live health data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="py-16 px-4 bg-red-50 dark:bg-red-900/10 rounded-[32px] border border-red-100 dark:border-red-900/20 max-w-2xl mx-auto my-12 text-center">
      <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Firestore Access Issue</h3>
      <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
        We're having trouble connecting to the live health feed. Please ensure your Firestore security rules are deployed.
      </p>
      <button 
        onClick={loadFeed}
        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-2xl font-bold transition-all active:scale-95"
      >
        <RefreshCcw className="w-4 h-4" />
        Retry Connection
      </button>
      <div className="mt-6 text-[10px] font-mono text-red-400 uppercase tracking-widest bg-white dark:bg-slate-900 py-2 px-4 rounded-full inline-block border border-red-100 dark:border-red-900/20">
        Error: {error}
      </div>
    </div>
  );

  return (
    <section className="py-12 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t.feed.recommended}</h2>
            <p className="text-slate-500 dark:text-slate-400">{t.feed.subtitle}</p>
          </div>
          <Link href="/articles" className="text-blue-600 font-medium hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            {t.common.viewAll}
          </Link>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <FeedCard key={item.id} item={item} index={index} t={t} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px]">
             <p className="text-slate-500 font-medium">No live feed items found in the database.</p>
             <p className="text-slate-400 text-sm mt-2">Try running the seed script to populate data.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function FeedCard({ item, index, t }: { item: FeedItem, index: number, t: any }) {
  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Medical': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Herbal': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      default: return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
      case 'B': return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800';
      case 'C': return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800';
      default: return 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
    }
  };

  const displayCategory = item.category === 'Medical' ? t.common.medical : item.category === 'Herbal' ? t.common.herbal : item.category;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full"
    >
      <div className="h-32 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
        {/* Placeholder Pattern since we don't have real images yet */}
        <div className={`absolute inset-0 opacity-10 ${
          item.category === 'Medical' ? 'bg-blue-500' : 
          item.category === 'Herbal' ? 'bg-emerald-500' : 'bg-purple-500'
        }`} />
        
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(item.category)}`}>
            {displayCategory}
          </span>
          {item.evidenceGrade && (
            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${getGradeColor(item.evidenceGrade)}`}>
              <ShieldCheck className="w-3 h-3" />
              Grade {item.evidenceGrade}
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
            {item.type === 'video' ? (
              <PlayCircle className="w-4 h-4 text-slate-700" />
            ) : (
              <FileText className="w-4 h-4 text-slate-700" />
            )}
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{item.source}</span>
          <span>•</span>
          <span>{item.date}</span>
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {item.title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-3 flex-1">
          {item.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
          {item.isVerified ? (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{t.feed.verified}</span>
            </div>
          ) : (
             <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
              <span>{t.feed.community}</span>
            </div>
          )}
          
          <button className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
