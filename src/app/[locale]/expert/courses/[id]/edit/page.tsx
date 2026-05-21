'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { contentService } from '@/services/contentService';
import { getLearningPathById } from '@/services/learningService';
import { Loader2 } from 'lucide-react';
import { Module, LearningPath } from '@/types/learning';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { CourseCurriculumBuilder } from '@/components/expert/CourseCurriculumBuilder';
import { CourseStudioHeader } from '@/components/expert/studio/CourseStudioHeader';
import { CourseOverviewTab } from '@/components/expert/studio/CourseOverviewTab';
import { CoursePreviewTab } from '@/components/expert/studio/CoursePreviewTab';
import { motion, AnimatePresence } from 'framer-motion';

type StudioTab = 'overview' | 'curriculum' | 'preview';

export default function EditCoursePage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<StudioTab>('overview');
  const [courseData, setCourseData] = useState<LearningPath | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Medical' | 'Herbal' | 'Lifestyle'>('Medical');
  const [icon, setIcon] = useState('book');
  const [modules, setModules] = useState<Module[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const data = await getLearningPathById(id);
        if (data) {
          setCourseData(data);
          setTitle(data.title);
          setDescription(data.description);
          setCategory(data.category || 'Medical');
          setIcon(data.icon || 'book');
          setModules(data.modules || []);
        } else {
          setError('Course not found');
        }
      } catch (err) {
        console.error("Failed to fetch course:", err);
        setError('Failed to load course details');
      }
      setInitialLoading(false);
    };

    fetchCourseData();
  }, [id]);

  const handleUpdate = async (status: 'draft' | 'published') => {
    if (!title || !description || modules.length === 0) {
      setError('Please fill in title, description and add at least one module.');
      return;
    }

    setLoading(true);
    setError('');
    setSaveSuccess(false);

    try {
      const user = auth.currentUser;
      if (user) {
        await contentService.updateLearningPath(id, {
          title,
          description,
          category,
          icon,
          totalModules: modules.length,
          modules,
          status,
        });
        
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <ExpertLayout title="Expert Studio" backLink={`/expert/dashboard?tab=courses`}>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium tracking-wide text-xs uppercase tracking-widest">Opening Studio...</p>
        </div>
      </ExpertLayout>
    );
  }

  return (
    <ExpertLayout
      title="Course Studio"
      subtitle="The professional environment for crafting elite clinical education."
      backLink={`/expert/dashboard?tab=courses`}
    >
      <div className="flex flex-col gap-8">
        <CourseStudioHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          saveSuccess={saveSuccess}
          loading={loading}
          handleUpdate={handleUpdate}
        />

        {/* Studio Workspace */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <CourseOverviewTab
                title={title}
                setTitle={setTitle}
                category={category}
                setCategory={setCategory}
                description={description}
                setDescription={setDescription}
              />
            )}

            {activeTab === 'curriculum' && (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <CourseCurriculumBuilder modules={modules} setModules={setModules} />
              </motion.div>
            )}

            {activeTab === 'preview' && (
              <CoursePreviewTab courseId={id} />
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-black uppercase tracking-widest rounded-2xl border border-red-100 dark:border-red-800 text-center">
            Error: {error}
          </div>
        )}
      </div>
    </ExpertLayout>
  );
}
