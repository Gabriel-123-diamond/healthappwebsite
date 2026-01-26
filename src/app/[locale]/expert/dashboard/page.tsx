'use client';

import React, { useEffect, useState } from 'react';
import { getExpertStats, getExpertContent, ExpertStats, ExpertContent } from '@/services/expertDashboardService';
import { FileText, MessageSquare, Star, Plus, Eye, Clock, Loader2 } from 'lucide-react';
import ExpertStatCard from '@/components/expert/ExpertStatCard';
import ExpertContentTable from '@/components/expert/ExpertContentTable';

export default function ExpertDashboardPage() {
  const [stats, setStats] = useState<ExpertStats | null>(null);
  const [content, setContent] = useState<ExpertContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getExpertStats(), getExpertContent()]).then(([statsData, contentData]) => {
      setStats(statsData);
      setContent(contentData);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-20 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Expert Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Manage your content and track your impact.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Content
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <ExpertStatCard icon={<Eye className="w-6 h-6 text-blue-600" />} label="Total Views" value={stats?.totalViews.toLocaleString() || '0'} color="bg-blue-50 dark:bg-blue-900/20" />
          <ExpertStatCard icon={<MessageSquare className="w-6 h-6 text-emerald-600" />} label="Questions Answered" value={stats?.questionsAnswered.toString() || '0'} color="bg-emerald-50 dark:bg-emerald-900/20" />
          <ExpertStatCard icon={<FileText className="w-6 h-6 text-purple-600" />} label="Articles Published" value={stats?.articlesPublished.toString() || '0'} color="bg-purple-50 dark:bg-purple-900/20" />
          <ExpertStatCard icon={<Star className="w-6 h-6 text-amber-600" />} label="Average Rating" value={stats?.rating.toString() || '0'} color="bg-amber-50 dark:bg-amber-900/20" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content Management */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your Content</h2>
            <ExpertContentTable content={content} />
          </div>

          {/* Quick Actions / Notifications */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Pending Actions</h2>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-4">
              <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/30">
                <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-900 dark:text-amber-400 text-sm">Pending Verification</h3>
                  <p className="text-amber-700 dark:text-amber-500 text-xs mt-1">Your credentials are currently under review by our admin team.</p>
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-700 pt-4">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">Community Questions</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2">Is Ashwagandha safe to take with anti-depressants?</p>
                    <span className="text-xs text-slate-400 mt-2 block">Herbal • 2 hours ago</span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                    <p className="text-sm text-slate-700 dark:text-slate-300 font-medium line-clamp-2">Best recovery stretches after ACL surgery?</p>
                    <span className="text-xs text-slate-400 mt-2 block">Medical • 5 hours ago</span>
                  </div>
                </div>
                <button className="w-full mt-4 text-blue-600 dark:text-blue-400 text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 py-2 rounded-lg transition-colors">
                  View All Questions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}