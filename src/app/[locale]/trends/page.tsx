'use client';

import React, { useEffect, useState } from 'react';
import { trendService, TrendItem } from '@/services/trendService';
import { BarChart3, TrendingUp, Activity, Loader2, RefreshCw, Search, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';

export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadTrends = async () => {
    setLoading(true);
    const data = await trendService.getTrendingTopics();
    setTrends(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTrends();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-12 px-4">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs mb-3">
              <Activity size={14} /> Global Health Insights
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Health Research Trends</h1>
            <p className="text-slate-500 max-w-xl">
              Anonymized global search data revealing the most discussed health topics and herbal remedies.
            </p>
          </div>
          <button 
            onClick={loadTrends}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Data
          </button>
        </header>

        {loading ? (
          <div className="flex justify-center py-32">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Chart */}
            <section className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                <TrendingUp className="text-blue-600" />
                Top Trending Topics
              </h2>

              <div className="space-y-6">
                {trends.map((item, index) => (
                  <div key={item.query} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400">
                          {index + 1}
                        </span>
                        <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{item.query}</span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase ${
                          item.mode === 'medical' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {item.mode}
                        </span>
                      </div>
                      <span className="text-slate-400 font-medium">{item.count} searches</span>
                    </div>
                    <div className="h-2.5 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.count / trends[0].count) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                        className={`h-full rounded-full ${item.mode === 'medical' ? 'bg-blue-500' : 'bg-emerald-500'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Sidebar Stats */}
            <aside className="space-y-6">
              <div className="bg-blue-600 p-8 rounded-[32px] text-white shadow-xl shadow-blue-500/20">
                <h3 className="text-lg font-bold mb-2">Total Queries Analyzed</h3>
                <div className="text-4xl font-black mb-4">100+</div>
                <p className="text-blue-100 text-xs leading-relaxed">
                  Our algorithm processes real-time search patterns to identify emerging health concerns globally.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4">Quick Search</h3>
                <p className="text-slate-500 text-sm mb-6">Contribute to global trends by searching for a topic.</p>
                <Link 
                  href="/"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white rounded-2xl text-sm font-bold transition-all group"
                >
                  <Search size={16} />
                  Start Searching
                </Link>
              </div>
            </aside>

          </div>
        )}
      </div>
    </div>
  );
}
