'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { contentService } from '@/services/contentService';
import { Layout, ListTree, Eye, Send, Loader2 } from 'lucide-react';
import { Module } from '@/types/learning';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { CourseCurriculumBuilder } from '@/components/expert/CourseCurriculumBuilder';
import { CourseOverview } from '@/components/expert/CourseOverview';
import { CoursePreview } from '@/components/expert/CoursePreview';
import { motion, AnimatePresence } from 'framer-motion';

type StudioTab = 'overview' | 'curriculum' | 'preview';

export default function NewCoursePage() {
  const [activeTab, setActiveTab] = useState<StudioTab>('overview');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Medical' | 'Herbal' | 'Lifestyle'>('Medical');
  const [icon, setIcon] = useState('book');
  const [modules, setModules] = useState<Module[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expertName, setExpertName] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const fetchExpertData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setExpertName(userDoc.data().fullName || userDoc.data().name || 'Expert');
        }
      }
    };
    fetchExpertData();
  }, []);

  const handleCreate = async (status: 'draft' | 'published') => {
    if (!title || !description) {
      setError('Please fill in the title and executive summary.');
      setActiveTab('overview');
      return;
    }

    if (modules.length === 0) {
      setError('Please add at least one module in the Curriculum Builder.');
      setActiveTab('curriculum');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        const finalAuthorName = expertName || user.displayName || 'Expert';
        
        const courseId = await contentService.createLearningPath({
          title,
          description,
          category,
          icon,
          authorId: user.uid,
          authorName: finalAuthorName,
          totalModules: modules.length,
          modules,
          status,
          enrolledCount: 0,
          createdAt: new Date().toISOString()
        });
        
        router.push(`/expert/courses/${courseId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to initialize course');
    } finally {
      setLoading(false);
    }
  };

  const tabItems = [
    { id: 'overview', label: 'Course Overview', icon: Layout },
    { id: 'curriculum', label: 'Curriculum Builder', icon: ListTree },
    { id: 'preview', label: 'Live Preview', icon: Eye },
  ];

  return (
    <ExpertLayout
      title="Course Creation Studio"
      subtitle="Crafting the next generation of clinical intelligence nodes."
      backLink="/expert/dashboard?tab=courses"
    >
      <div className="flex flex-col gap-8">
        {/* Studio Header & Tab Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-white/5 shadow-xl">
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as StudioTab)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-lg' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <tab.icon size={14} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleCreate('draft')}
              disabled={loading}
              className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleCreate('published')}
              disabled={loading}
              className="px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white bg-blue-600 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Publish Course
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <CourseOverview
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                category={category}
                setCategory={setCategory}
                modules={modules}
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
              <CoursePreview onSaveDraft={() => handleCreate('draft')} />
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
