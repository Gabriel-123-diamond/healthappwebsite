'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { contentService } from '@/services/contentService';
import { getLearningPathById } from '@/services/learningService';
import { BaseInput } from '@/components/common/BaseInput';
import { BaseTextArea } from '@/components/common/BaseTextArea';
import { Book, Save, Send, Loader2, Layout, ListTree, Eye, Settings, ChevronLeft, Sparkles } from 'lucide-react';
import { Module, LearningPath } from '@/types/learning';
import { ExpertLayout } from '@/components/expert/ExpertLayout';
import { CourseCurriculumBuilder } from '@/components/expert/CourseCurriculumBuilder';
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

  const tabItems = [
    { id: 'overview', label: 'Course Overview', icon: Layout },
    { id: 'curriculum', label: 'Curriculum Builder', icon: ListTree },
    { id: 'preview', label: 'Live Preview', icon: Eye },
  ];

  return (
    <ExpertLayout
      title="Course Studio"
      subtitle="The professional environment for crafting elite clinical education."
      backLink={`/expert/dashboard?tab=courses`}
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
            <AnimatePresence>
              {saveSuccess && (
                <motion.span 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mr-4"
                >
                  ✓ Changes Synced
                </motion.span>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => handleUpdate('draft')}
              disabled={loading}
              className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-2xl transition-all"
            >
              Save Draft
            </button>
            <button
              onClick={() => handleUpdate('published')}
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
                    <h3 className="text-xl font-black uppercase tracking-tight mb-6 relative z-10">Pro Studio Tip</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8 relative z-10">
                      High-converting courses usually have at least 3-5 modules with a mix of video and technical articles. Ensure your executive summary highlights the specific clinical value students will gain.
                    </p>
                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 relative z-10">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quality Score</span>
                        <span className="text-blue-400 font-black">85%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[85%]" />
                      </div>
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
                className="bg-white dark:bg-slate-900 rounded-[48px] border-4 border-slate-100 dark:border-white/5 shadow-3xl overflow-hidden h-[800px] relative"
              >
                <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950/50 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-8">
                    <Eye className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Live Sandbox Mode</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium mb-10">
                    Your course is currently rendering in the clinical sandbox. Changes made in the Curriculum tab will reflect here in real-time.
                  </p>
                  <Link 
                    href={`/learning/${id}`} 
                    target="_blank"
                    className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
                  >
                    Open Full Preview in New Tab
                  </Link>
                </div>
                {/* We could use an iframe here if needed, but a button to open in new tab is safer for complex React state sync */}
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
