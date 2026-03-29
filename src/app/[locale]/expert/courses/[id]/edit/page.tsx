'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { contentService } from '@/services/contentService';
import { getLearningPathById } from '@/services/learningService';
import { useLanguage } from '@/context/LanguageContext';
import { BaseInput } from '@/components/common/BaseInput';
import { BaseTextArea } from '@/components/common/BaseTextArea';
import { Book, Save, Send, Loader2 } from 'lucide-react';
import { Module } from '@/types/learning';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { CourseCurriculumBuilder } from '@/components/expert/CourseCurriculumBuilder';

export default function EditCoursePage() {
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Medical' | 'Herbal' | 'Lifestyle'>('Medical');
  const [icon, setIcon] = useState('book');
  const [modules, setModules] = useState<Module[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseData = await getLearningPathById(id);
        if (courseData) {
          setTitle(courseData.title);
          setDescription(courseData.description);
          setCategory(courseData.category || 'Medical');
          setIcon(courseData.icon || 'book');
          setModules(courseData.modules || []);
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

  const handlePublish = async (status: 'draft' | 'published') => {
    if (!title || !description || modules.length === 0) {
      setError('Please fill in title, description and add at least one module.');
      return;
    }

    setLoading(true);
    setError('');

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
        
        router.push(\`/expert/courses/\${id}\`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <ExpertLayout title="Edit Course" backLink={\`/expert/courses/\${id}\`}>
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-500 font-medium tracking-wide">Loading course builder...</p>
        </div>
      </ExpertLayout>
    );
  }

  const actions = (
    <>
      <button
        onClick={() => handlePublish('draft')}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
      >
        <Save className="w-4 h-4" />
        Save Draft
      </button>
      <button
        onClick={() => handlePublish('published')}
        disabled={loading}
        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Update Settings
      </button>
    </>
  );

  return (
    <ExpertLayout
      title="Edit Course"
      subtitle="Update course content, adjust curriculum, and manage settings."
      backLink={\`/expert/courses/\${id}\`}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Book className="w-5 h-5 text-blue-600" />
              Course Information
            </h2>
            
            <BaseInput
              id="title"
              name="title"
              label="Course Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Masterclass in Herbal Remedies"
            />

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
              >
                <option value="Medical">Medical Science</option>
                <option value="Herbal">Traditional Herbal</option>
                <option value="Lifestyle">Lifestyle & Wellness</option>
              </select>
            </div>

            <BaseTextArea
              id="description"
              label="Course Description"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="What will students learn in this course?"
            />
          </div>
        </div>

        {/* Curriculum Builder */}
        <div className="lg:col-span-2 space-y-6">
          <CourseCurriculumBuilder modules={modules} setModules={setModules} />
          
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800 text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </ExpertLayout>
  );
}
