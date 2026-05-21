import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, Calendar, Search, TrendingUp, Zap, Star } from 'lucide-react';

interface AnalyticsTabProps {
  analytics: any;
}

export function AnalyticsTab({ analytics }: AnalyticsTabProps) {
  if (!analytics) return null;

  const stats = [
    { label: 'Total Citizens', value: analytics.totalUsers, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Intelligence Nodes', value: analytics.totalExperts, icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Clinical Engagements', value: analytics.totalAppointments, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Search Queries', value: analytics.totalInsights, icon: Search, color: 'text-orange-500', bg: 'bg-orange-50' },
  ];

  return (
    <motion.div 
      key="analytics"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="space-y-10"
    >
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">System Intelligence</h2>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px] font-black">Global Data Feed Overview</p>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm">
            <div className={`w-12 h-12 rounded-2xl ${stat.bg} dark:bg-white/5 flex items-center justify-center ${stat.color} mb-6`}>
              <stat.icon size={24} />
            </div>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">{stat.value.toLocaleString()}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tier Distribution */}
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Access Distribution</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Tier Logic Analysis</p>
            </div>
          </div>

          <div className="space-y-6">
            {Object.entries(analytics.tiers).map(([tier, count]: [string, any]) => (
              <div key={tier} className="space-y-2">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{tier} Node</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white">{count}</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / analytics.totalUsers) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth & Activity */}
        <div className="bg-slate-900 dark:bg-black p-10 rounded-[48px] text-white shadow-xl">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900">
              <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Network Growth</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">7-Day Momentum</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="w-32 h-32 rounded-full border-8 border-blue-500 border-t-white flex items-center justify-center relative">
               <span className="text-3xl font-black tracking-tighter">+{analytics.recentSignups}</span>
            </div>
            <div className="text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400 mb-1">Recent Signups</p>
              <p className="text-slate-400 text-xs font-medium max-w-[200px]">Expansion protocols active. {analytics.recentSignups} new identity nodes verified this week.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
