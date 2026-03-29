'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { contentService } from '@/services/contentService';
import { BaseInput } from '@/components/common/BaseInput';
import { BaseTextArea } from '@/components/common/BaseTextArea';
import { Layout, ListTree, Eye, Settings, Sparkles, Send, Save, Loader2 } from 'lucide-react';
import { Module } from '@/types/learning';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { CourseCurriculumBuilder } from '@/components/expert/CourseCurriculumBuilder';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

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
        const courseId = await contentService.createLearningPath({
          title,
          description,
          category,
          icon,
          authorId: user.uid,
          authorName: expertName,
          totalModules: modules.length,
          modules,
          status,
          enrolledCount: 0
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
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                <div className="lg:col-span-7 space-y-8">
                  <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-2xl space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                        <Settings size={20} />
                      </div>
                      <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Core Configuration</h2>
                    </div>

                    <BaseInput
                      id="title"
                      label="Course Master Title"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter a powerful, clinical title"
                      className="!rounded-2xl"
                    />

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest block">
                        Clinical Category
                      </label>
                      <div className="grid grid-cols-3 gap-4">
                        {(['Medical', 'Herbal', 'Lifestyle'] as const).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategory(cat)}
                            className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                              category === cat 
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                                : 'border-slate-100 dark:border-white/5 text-slate-400 hover:border-slate-200'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <BaseTextArea
                      id="description"
                      label="Executive Summary"
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      placeholder="Provide a detailed overview of the curriculum and learning outcomes."
                      className="!rounded-[32px]"
                    />
                  </div>
                </div>

                <div className="lg:col-span-5 space-y-8">
                  <div className="bg-slate-900 rounded-[40px] p-10 border border-white/5 shadow-2xl relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Sparkles size={120} />
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-6 relative z-10">Studio Onboarding</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">
                      Welcome to the Course Creation Studio. Use the tabs above to define your course structure and content. You can save your progress as a draft at any time.
                    </p>
                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 relative z-10">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Checklist</h4>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <div className={`w-1.5 h-1.5 rounded-full ${title ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                          Set Course Title
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <div className={`w-1.5 h-1.5 rounded-full ${description ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                          Write Summary
                        </li>
                        <li className="flex items-center gap-2 text-xs font-bold text-slate-300">
                          <div className={`w-1.5 h-1.5 rounded-full ${modules.length > 0 ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                          Build Curriculum
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
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
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white dark:bg-slate-900 rounded-[48px] border-4 border-slate-100 dark:border-white/5 shadow-3xl overflow-hidden h-[800px] relative flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-8">
                  <Eye className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Preview Unavailable</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium mb-10">
                  Please save your course as a draft first to enable the live clinical preview node.
                </p>
                <button
                  onClick={() => handleCreate('draft')}
                  className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                  Save Draft to Unlock Preview
                </button>
              </motion.div>
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
