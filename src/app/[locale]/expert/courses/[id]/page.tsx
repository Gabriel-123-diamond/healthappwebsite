'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { contentService } from '@/services/contentService';
import { getLearningPathById, LearningPath } from '@/services/learningService';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { Users, Clock, Award, BookOpen, Edit, Download, CheckCircle, BrainCircuit } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function CourseDashboardPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [course, setCourse] = useState<LearningPath | null>(null);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'starting' | 'halfway' | 'completed'>('all');

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseData = await getLearningPathById(id);
        if (courseData) {
          setCourse(courseData);
          const enrollmentsData = await contentService.getCourseEnrollments(id);
          setEnrollments(enrollmentsData);
          setFilteredEnrollments(enrollmentsData);
        }
      } catch (error) {
        console.error("Failed to fetch course dashboard data:", error);
      }
      setLoading(false);
    };

    fetchCourseData();
  }, [id]);

  useEffect(() => {
    let result = enrollments;
    if (filter === 'starting') {
      result = enrollments.filter(e => (e.progress || 0) < 20);
    } else if (filter === 'halfway') {
      result = enrollments.filter(e => (e.progress || 0) >= 20 && (e.progress || 0) < 90);
    } else if (filter === 'completed') {
      result = enrollments.filter(e => (e.progress || 0) >= 90);
    }
    setFilteredEnrollments(result);
  }, [filter, enrollments]);

  if (loading) {
    return (
      <ExpertLayout title="Course Dashboard" backLink="/expert/dashboard?tab=courses">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading course details...</p>
        </div>
      </ExpertLayout>
    );
  }

  if (!course) {
    return (
      <ExpertLayout title="Course Not Found" backLink="/expert/dashboard?tab=courses">
        <div className="p-12 text-center text-slate-500">The course you are looking for does not exist or has been deleted.</div>
      </ExpertLayout>
    );
  }

  const actions = (
    <div className="flex gap-3">
      <Link
        href={`/learning/${course.id}`}
        target="_blank"
        className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-2 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 transition-all"
      >
        <BookOpen className="w-4 h-4" />
        Preview Course
      </Link>
      <Link
        href={`/expert/courses/${course.id}/edit`}
        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
      >
        <Edit className="w-4 h-4" />
        Edit Content
      </Link>
    </div>
  );

  return (
    <ExpertLayout
      title={course.title}
      subtitle="Course Dashboard - Analytics & Student Progress"
      backLink="/expert/dashboard?tab=courses"
      actions={actions}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-xl">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Enrolled</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{enrollments.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl">
            <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Modules</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white leading-none">{course.totalModules || 0}</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 dark:bg-amber-900/40 rounded-xl">
            <CheckCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
            <p className="text-xl font-black text-slate-900 dark:text-white leading-none capitalize">{course.status || 'Draft'}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-500" />
            Enrolled Students Activity
          </h2>
          
          <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-100 dark:border-slate-800">
            {(['all', 'starting', 'halfway', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f 
                    ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        
        {filteredEnrollments.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No students match this filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Student Info</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Enrolled At</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Progress</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Lessons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredEnrollments.map((enrollment, index) => (
                  <tr key={enrollment.id || index} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white uppercase tracking-tight">{enrollment.userName || 'Anonymous'}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{enrollment.userEmail || 'No Email'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                      {enrollment.enrolledAt?.toDate?.()?.toLocaleDateString() || 'Recent'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden max-w-[100px]">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 dark:text-slate-300">{enrollment.progress || 0}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[10px] font-black text-slate-500 dark:text-slate-400">
                      {(enrollment.completedLessons || []).length} COMPLETED
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ExpertLayout>
  );
}
