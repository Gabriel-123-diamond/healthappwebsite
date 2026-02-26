'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { analyticsService, AnalyticsData } from '@/services/analyticsService';
import { TrendingUp, Users, BookOpen, Star, FileText, ArrowLeft, Loader2, BarChart2, Activity } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import ExpertStatCard from '@/components/expert/ExpertStatCard';
import { ExpertLayout } from '@/components/expert/ExpertLayout';

export default function ExpertAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    analyticsService.getExpertAnalytics(user.uid).then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 w-8 h-8" /></div>;
  }

  return (
    <ExpertLayout
      title="Performance Analytics"
      subtitle="Track your professional reach and impact across the platform."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <ExpertStatCard 
            icon={<TrendingUp className="w-6 h-6 text-emerald-600" />} 
            label="Profile Views" 
            value={data?.profileViews.toLocaleString() || '0'} 
            color="bg-emerald-50 dark:bg-emerald-900/20" 
          />
          <ExpertStatCard 
            icon={<FileText className="w-6 h-6 text-blue-600" />} 
            label="Article Reads" 
            value={data?.articleReads.toLocaleString() || '0'} 
            color="bg-blue-50 dark:bg-blue-900/20" 
          />
          <ExpertStatCard 
            icon={<BookOpen className="w-6 h-6 text-purple-600" />} 
            label="Course Enrollees" 
            value={data?.courseEnrollments.toLocaleString() || '0'} 
            color="bg-purple-50 dark:bg-purple-900/20" 
          />
          <ExpertStatCard 
            icon={<Star className="w-6 h-6 text-amber-600" />} 
            label="Avg. Rating" 
            value={data?.averageRating.toFixed(1) || 'N/A'} 
            color="bg-amber-50 dark:bg-amber-900/20" 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Chart Simulation */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-lg mb-8 flex justify-between items-center">
                Monthly Growth Trend
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">LIVE DATA</span>
              </h3>
              
              <div className="h-64 flex items-end justify-between gap-4">
                {data?.monthlyGrowth.map((month, i) => (
                  <div key={i} className="flex-grow flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end gap-1 h-full">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.views / 1500) * 100}%` }}
                        className="bg-blue-500 w-full rounded-t-lg transition-all group-hover:bg-blue-600"
                      />
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.enrollments / 50) * 100}%` }}
                        className="bg-purple-500 w-full rounded-t-lg transition-all group-hover:bg-purple-600"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{month.month}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex gap-6 justify-center">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-3 h-3 bg-blue-500 rounded-sm" /> Profile Views
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <div className="w-3 h-3 bg-purple-500 rounded-sm" /> Enrollments
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Recent Activity
              </h3>
              <div className="space-y-6">
                {data?.recentActivity.map((act) => (
                  <div key={act.id} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      act.type === 'read' ? 'bg-blue-50 text-blue-600' :
                      act.type === 'enrollment' ? 'bg-purple-50 text-purple-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {act.type === 'read' ? <FileText className="w-4 h-4" /> :
                       act.type === 'enrollment' ? <BookOpen className="w-4 h-4" /> :
                       <Star className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{act.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{act.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Pro Insight</h3>
              <p className="text-blue-100 text-sm mb-4">Your "Article Reads" increased by 15% this week. Keep publishing to grow your reach!</p>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-all border border-white/20">
                Generate Monthly Report
              </button>
            </div>
          </div>
        </div>
    </ExpertLayout>
  );
}
