'use client';

import { AlertCircle, RefreshCcw } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Link } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { getFeedItems } from '@/services/feedService';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { FeedCard } from './FeedCard';

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
