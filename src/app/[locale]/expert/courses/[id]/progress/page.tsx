'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contentService } from '@/services/contentService';
import { getLearningPathById, LearningPath } from '@/services/learningService';
import { ArrowLeft, Users, CheckCircle, Clock, Loader2, Search, Filter, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

export default function CourseProgressPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [pathData, enrollmentsData] = await Promise.all([
        getLearningPathById(id),
        contentService.getCourseEnrollments(id)
      ]);
      setPath(pathData || null);
      setEnrollments(enrollmentsData);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4 text-center">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">COURSE NOT FOUND</h2>
        <Link href="/expert/dashboard" className="text-blue-600 font-bold hover:underline uppercase tracking-widest text-sm">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/expert/dashboard?tab=courses" className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                <Users size={12} className="text-blue-600 dark:text-blue-400" />
                <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Student Telemetry</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">{path.title}</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Detailed progress tracking for all enrolled clinical nodes.</p>
            </div>

            <div className="grid grid-cols-2 gap-4 shrink-0">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Joined</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{enrollments.length}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Progress</p>
                <p className="text-3xl font-black text-blue-600 dark:text-blue-400 leading-none">
                  {enrollments.length > 0 
                    ? Math.round(enrollments.reduce((acc, curr) => acc + (curr.progress || 0), 0) / enrollments.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search user ID or email..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-white/5 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 dark:bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all">
              <Filter size={14} />
              Filter
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
              <TrendingUp size={14} />
              Export Report
            </button>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-white/5">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Identifier</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Progress</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Lessons</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Last Active</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-24 text-center">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Users size={32} />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No students enrolled yet.</p>
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enrollment, idx) => (
                    <tr key={enrollment.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-black flex items-center justify-center text-white font-black text-xs border border-white/10">
                            {enrollment.userId?.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-white truncate max-w-[150px]">{enrollment.userId}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Clinical Node</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="w-full max-w-[120px] space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                            <span>{enrollment.progress || 0}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${enrollment.progress || 0}%` }}
                              className="h-full bg-blue-600 rounded-full"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                          {enrollment.completedLessons?.length || 0} / {path.totalModules * 2} {/* Approximate lessons */}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-500">
                          {enrollment.lastUpdated ? new Date(enrollment.lastUpdated.seconds * 1000).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <button className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 hover:text-blue-600 transition-all shadow-sm active:scale-90">
                          <Search size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
