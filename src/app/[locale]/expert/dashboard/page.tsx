'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { reviewService, PendingReview } from '@/services/reviewService';
import { userService } from '@/services/userService';
import { contentService } from '@/services/contentService';
import { auth } from '@/lib/firebase';
import { CheckCircle, Star, Users, BookOpen, FileText, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import ExpertStatCard from '@/components/expert/ExpertStatCard';
import { VerificationCard } from '@/components/expert/VerificationCard';
import { ReviewQueue } from '@/components/expert/ReviewQueue';
import { ExpertDashboardHeader } from '@/components/expert/ExpertDashboardHeader';
import { ExpertDashboardActions } from '@/components/expert/ExpertDashboardActions';
import { Article } from '@/types/article';
import { LearningPath } from '@/types/learning';

export default function ExpertDashboard() {
  const { t } = useLanguage();
  const [pending, setPending] = useState<PendingReview[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [courses, setCourses] = useState<LearningPath[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'queue' | 'articles' | 'courses'>('queue');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const [pendingData, profileData, articlesData, coursesData] = await Promise.all([
          reviewService.getPendingReviews(),
          userService.getUserProfile(user.uid),
          contentService.getExpertArticles(user.uid),
          contentService.getExpertLearningPaths(user.uid)
        ]);

        setPending(pendingData);
        setProfile(profileData);
        setArticles(articlesData);
        setCourses(coursesData);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-12">
          <ExpertDashboardHeader />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ExpertStatCard icon={<FileText />} label="Intelligence Records" value={articles.length.toString()} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600" />
          <ExpertStatCard icon={<BookOpen />} label="Learning Paths" value={courses.length.toString()} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600" />
          <ExpertStatCard icon={<Users />} label="Impact Reach" value={profile?.views || "0"} color="bg-purple-50 dark:bg-purple-900/20 text-purple-600" />
          <ExpertStatCard icon={<Star />} label="Clinical Rating" value={profile?.rating || "N/A"} color="bg-amber-50 dark:bg-amber-900/20 text-amber-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-800 shadow-sm w-fit">
              {(['queue', 'articles', 'courses'] as const).map(tab => (
                <button 
                  key={tab} 
                  onClick={() => setActiveTab(tab)} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                      : 'text-slate-400 hover:text-blue-600'
                  }`}
                >
                  {tab === 'queue' ? 'Verification Queue' : tab === 'articles' ? 'My Archives' : 'My Courses'}
                </button>
              ))}
            </div>

            <section className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-3xl shadow-blue-900/5 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'queue' ? (
                    <ReviewQueue pending={pending} loading={loading} />
                  ) : activeTab === 'articles' ? (
                    <ArticleList articles={articles} />
                  ) : (
                    <CourseList courses={courses} />
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              <VerificationCard status={profile?.verificationStatus || 'unverified'} type={profile?.type} />
              <ExpertDashboardActions expertId={profile?.id} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const ArticleList = ({ articles }: { articles: Article[] }) => (
  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
    <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
          <FileText className="text-blue-600 w-5 h-5" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Record Inventory</h2>
      </div>
      <Link href="/expert/articles/new" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">Write New</Link>
    </div>
    <div className="p-2">
      {articles.length === 0 ? (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">No published documentation</p>
          <Link href="/expert/articles/new" className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline">Initialize first entry</Link>
        </div>
      ) : (
        articles.map(article => (
          <div key={article.id} className="p-6 sm:p-8 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-[32px] group">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight capitalize">{article.title}</h3>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${article.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100'}`}>{article.status}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{article.category}</span>
              </div>
            </div>
            <Link href={`/article/${article.id}`} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm active:scale-90">
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        ))
      )}
    </div>
  </div>
);

const CourseList = ({ courses }: { courses: LearningPath[] }) => (
  <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
    <div className="p-8 sm:p-10 border-b border-slate-50 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950/50">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800">
          <BookOpen className="text-blue-600 w-5 h-5" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Learning Programs</h2>
      </div>
      <Link href="/expert/courses/new" className="px-5 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20">Initialize</Link>
    </div>
    <div className="p-2">
      {courses.length === 0 ? (
        <div className="py-32 text-center">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-4">No active curricula</p>
          <Link href="/expert/courses/new" className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline">Build first course</Link>
        </div>
      ) : (
        courses.map(course => (
          <div key={course.id} className="p-6 sm:p-8 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-[32px] group">
            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tight capitalize">{course.title}</h3>
              <div className="flex items-center gap-4">
                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${course.status === 'published' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-100' : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-100'}`}>{course.status}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.category}</span>
              </div>
            </div>
            <Link href={`/learning/path/${course.id}`} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 transition-all shadow-sm active:scale-90">
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        ))
      )}
    </div>
  </div>
);
