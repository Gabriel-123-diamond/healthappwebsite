'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { contentService } from '@/services/contentService';
import { LearningPath } from '@/types/learning';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { Plus, BookOpen, Users, Edit, Trash2, LayoutDashboard } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useLanguage } from '@/context/LanguageContext';

export default function CoursesManagementPage() {
  const [courses, setCourses] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchCourses = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const expertCourses = await contentService.getExpertLearningPaths(user.uid);
          // Fetch enrollments for each course to show stats
          const coursesWithStats = await Promise.all(
            expertCourses.map(async (course) => {
              const enrollments = await contentService.getCourseEnrollments(course.id);
              return {
                ...course,
                enrolledCount: enrollments.length
              };
            })
          );
          setCourses(coursesWithStats);
        } catch (error) {
          console.error("Failed to fetch courses:", error);
        }
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      try {
        await contentService.deleteLearningPath(courseId);
        setCourses(courses.filter(c => c.id !== courseId));
      } catch (error) {
        console.error("Failed to delete course:", error);
        alert("Failed to delete course.");
      }
    }
  };

  const actions = (
    <Link
      href="/expert/courses/new"
      className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
    >
      <Plus className="w-4 h-4" />
      Create New Course
    </Link>
  );

  return (
    <ExpertLayout
      title="Course Management"
      subtitle="Manage your published educational courses, track enrollments, and create new learning paths."
      actions={actions}
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading your courses...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-16 text-center shadow-sm">
          <BookOpen className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-6" />
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">No Courses Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm mx-auto">Create your first course to share your expertise and start teaching others.</p>
          <Link
            href="/expert/courses/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-200 dark:shadow-none"
          >
            <Plus className="w-5 h-5" />
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <span className={\`inline-flex px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full \${course.status === 'published' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}\`}>
                    {course.status || 'Draft'}
                  </span>
                  <div className="flex gap-2 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={\`/expert/courses/\${course.id}/edit\`} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-blue-600 dark:text-blue-400">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-red-500 dark:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{course.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    {course.totalModules || 0} Modules
                  </span>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Users className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <span className="text-sm font-bold">{course.enrolledCount || 0} Students</span>
                </div>
                
                <Link 
                  href={\`/expert/courses/\${course.id}\`}
                  className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
                >
                  Manage
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </ExpertLayout>
  );
}
