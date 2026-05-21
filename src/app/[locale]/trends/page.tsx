'use client';

import React, { useEffect, useState } from 'react';
import { trendService, TrendItem } from '@/services/trendService';
import { BarChart3, TrendingUp, Activity, Loader2, RefreshCw, Search, ChevronLeft, Globe, Zap, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useRouter } from '@/i18n/routing';
import { AdminShortcut } from '@/components/common/AdminShortcut';

/**
 * TrendsPage Component
 * 
 * Provides global health research insights based on anonymized search data.
 * Features a dynamic chart of trending topics and a modular analysis sidebar.
 */
export default function TrendsPage() {
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadTrends = async () => {
    setLoading(true);
    try {
      const data = await trendService.getTrendingTopics();
      setTrends(data);
    } catch (error) {
      console.error("Failed to load trends:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 px-4 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <NavigationHeader onBack={() => router.back()} />
        </div>

        <TrendsHeader 
          loading={loading} 
          onRefresh={loadTrends} 
        />

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState />
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
            >
              {/* Main Analytical Chart */}
              <div className="lg:col-span-8">
                <TrendsChart trends={trends} />
              </div>

              {/* Intelligence Sidebar */}
              <aside className="lg:col-span-4 space-y-8">
                <IntelligenceMetricCard />
                <GlobalReachCard />
                <QuickSearchCard />
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Specialized Sub-components ---

function NavigationHeader({ onBack }: { onBack: () => void }) {
  return (
    <button 
      onClick={onBack} 
      className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
      Back to Terminal
    </button>
  );
}

function TrendsHeader({ loading, onRefresh }: { loading: boolean, onRefresh: () => void }) {
  return (
    <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-[10px] bg-blue-50 dark:bg-blue-900/20 w-fit px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
          <Activity size={12} /> Global Health Insights
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Research Trends</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl font-medium leading-relaxed">
          Anonymized global search data revealing the most discussed health topics and herbal remedies within the Ikiké network.
        </p>
      </div>
      <button 
        onClick={onRefresh}
        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-blue-500/30 transition-all shadow-sm active:scale-95"
      >
        <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        Sync Global Node
      </button>
    </header>
  );
}

function TrendsChart({ trends }: { trends: TrendItem[] }) {
  return (
    <section className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[48px] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-blue-900/5">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <TrendingUp className="text-blue-600 dark:text-blue-400" size={18} />
          </div>
          Trending Protocols
        </h2>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[8px] font-black uppercase text-slate-400">Medical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[8px] font-black uppercase text-slate-400">Herbal</span>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {trends.map((item, index) => (
          <div key={item.query} className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-100 dark:border-white/5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-black text-slate-800 dark:text-slate-200 capitalize tracking-tight text-base">{item.query}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider ${
                  item.mode === 'medical' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}>
                  {item.mode}
                </span>
                <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{item.count} Searches</span>
              </div>
            </div>
            <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-100 dark:border-white/5 p-0.5">        
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / (trends[0]?.count || 1)) * 100}%` }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: "circOut" }}
                className={`h-full rounded-full ${item.mode === 'medical' ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-emerald-500 shadow-lg shadow-emerald-500/20'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function IntelligenceMetricCard() {
  return (
    <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-3xl relative overflow-hidden group border border-white/5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/30 transition-colors" />
      <h3 className="text-sm font-black uppercase tracking-[0.2em] mb-2 text-slate-400">System Capacity</h3>
      <div className="text-5xl font-black tracking-tighter mb-4">120k+</div>
      <p className="text-slate-400 text-xs font-medium leading-relaxed">
        Our intelligence engine processes real-time search patterns to map emerging clinical concerns across the network.
      </p>
      <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Zap size={14} className="text-blue-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-widest">Active Processing</span>
        </div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
      </div>
    </div>
  );
}

function GlobalReachCard() {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-blue-900/5">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400"> 
           <Globe size={24} />
        </div>
        <div>
          <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight text-sm">Geographic Sync</h4>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-Regional Nodes</p>
        </div>
      </div>
      <div className="space-y-4">
        {[
          { label: 'Sub-Saharan Africa', value: '45%' },
          { label: 'Western Europe', value: '28%' },
          { label: 'North America', value: '15%' },
        ].map((region, i) => (
          <div key={i} className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tight">{region.label}</span>
            <span className="text-xs font-black text-blue-600 dark:text-blue-400">{region.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QuickSearchCard() {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
      <h3 className="font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight text-sm">Contribute to Trends</h3>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-6">Your searches help refine the global health intelligence map.</p>       
      <Link 
        href="/"
        className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl active:scale-95"
      >
        <Search size={14} strokeWidth={3} />
        Initialize Research
      </Link>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-40 gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Analytical Nodes</span>
    </div>
  );
}
