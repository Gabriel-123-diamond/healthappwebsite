'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createLearningPath, Module, Lesson } from '@/services/learningService';
import { ArrowLeft, Plus, Trash2, Save, Loader2, BookOpen, Activity, Leaf, Moon, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function CreateLearningPathPage() {
  const router = useRouter();
  const { isLoading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Medical' | 'Herbal' | 'Lifestyle'>('Medical');
  const [icon, setIcon] = useState('BookOpen');
  const [modules, setModules] = useState<Module[]>([
    { id: 'm1', title: 'Introduction', lessons: [{ id: 'l1', title: 'Welcome', duration: '5 min', type: 'article' }] }
  ]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const addModule = () => {
    const newModule: Module = {
      id: `m${modules.length + 1}`,
      title: '',
      lessons: [{ id: `l1`, title: '', duration: '5 min', type: 'article' }]
    };
    setModules([...modules, newModule]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModuleTitle = (index: number, val: string) => {
    const newModules = [...modules];
    newModules[index].title = val;
    setModules(newModules);
  };

  const addLesson = (moduleIndex: number) => {
    const newModules = [...modules];
    const newLesson: Lesson = {
      id: `l${newModules[moduleIndex].lessons.length + 1}`,
      title: '',
      duration: '5 min',
      type: 'article'
    };
    newModules[moduleIndex].lessons.push(newLesson);
    setModules(newModules);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...modules];
    if (newModules[moduleIndex].lessons.length > 1) {
      newModules[moduleIndex].lessons = newModules[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      setModules(newModules);
    }
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, val: string) => {
    const newModules = [...modules];
    (newModules[moduleIndex].lessons[lessonIndex] as any)[field] = val;
    setModules(newModules);
  };

  const handleSave = async () => {
    if (!title || !description) {
      alert('Please fill in course title and description.');
      return;
    }

    setLoading(true);
    try {
      await createLearningPath({
        title,
        description,
        category,
        icon,
        totalModules: modules.length,
        modules
      });
      alert('Course created successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 sticky top-0 z-10 transition-colors">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-600 dark:text-slate-400">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create New Course</h1>
          </div>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Course
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 space-y-4 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Course Details</h2>
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Course Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mastering Digestive Health"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-all font-medium text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What will users learn in this course?"
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-all font-medium resize-none text-slate-900 dark:text-white"
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Curriculum</h2>
                <button 
                  onClick={addModule}
                  className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-bold hover:underline"
                >
                  <Plus className="w-4 h-4" /> Add Module
                </button>
              </div>

              {modules.map((module, mIdx) => (
                <div key={module.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
                  <div className="p-4 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5 flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-3 flex-1 mr-4">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center text-xs font-bold transition-colors">
                        {mIdx + 1}
                      </span>
                      <input 
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModuleTitle(mIdx, e.target.value)}
                        placeholder="Module Title"
                        className="bg-transparent border-none font-bold text-slate-900 dark:text-white focus:ring-0 p-0 flex-1 outline-none"
                      />
                    </div>
                    <button 
                      onClick={() => removeModule(mIdx)}
                      className="text-slate-400 dark:text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-4 space-y-3">
                    {module.lessons.map((lesson, lIdx) => (
                      <div key={lesson.id} className="flex items-center gap-3 bg-slate-50 dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 transition-colors">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input 
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(mIdx, lIdx, 'title', e.target.value)}
                            placeholder="Lesson Title"
                            className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                          />
                          <input 
                            type="text"
                            value={lesson.duration}
                            onChange={(e) => updateLesson(mIdx, lIdx, 'duration', e.target.value)}
                            placeholder="Duration (e.g. 5 min)"
                            className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                          />
                          <select
                            value={lesson.type}
                            onChange={(e) => updateLesson(mIdx, lIdx, 'type', e.target.value as any)}
                            className="bg-white dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:border-blue-500 outline-none transition-all cursor-pointer"
                          >
                            <option value="article" className="dark:bg-slate-900">Article</option>
                            <option value="video" className="dark:bg-slate-900">Video</option>
                            <option value="quiz" className="dark:bg-slate-900">Quiz</option>
                          </select>
                        </div>
                        <button 
                          onClick={() => removeLesson(mIdx, lIdx)}
                          className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button 
                      onClick={() => addLesson(mIdx)}
                      className="w-full py-2 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl text-slate-400 dark:text-slate-500 text-xs font-bold hover:border-blue-300 dark:hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Lesson
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Sidebar Config */}
          <div className="space-y-6">
            <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 space-y-4 transition-colors">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Settings</h2>
              
              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Category</label>
                <div className="grid grid-cols-1 gap-2">
                  {(['Medical', 'Herbal', 'Lifestyle'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                        category === cat 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      {cat === 'Medical' && <Activity className="w-4 h-4" />}
                      {cat === 'Herbal' && <Leaf className="w-4 h-4" />}
                      {cat === 'Lifestyle' && <Moon className="w-4 h-4" />}
                      <span className="font-bold text-sm">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { n: 'BookOpen', i: <BookOpen className="w-4 h-4" /> },
                    { n: 'Activity', i: <Activity className="w-4 h-4" /> },
                    { n: 'Leaf', i: <Leaf className="w-4 h-4" /> },
                    { n: 'Moon', i: <Moon className="w-4 h-4" /> },
                    { n: 'Sparkles', i: <Sparkles className="w-4 h-4" /> },
                  ].map((item) => (
                    <button
                      key={item.n}
                      onClick={() => setIcon(item.n)}
                      className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all ${
                        icon === item.n 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-white/5 text-slate-400 dark:text-slate-500 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      {item.i}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <div className="bg-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-500/20 dark:shadow-none transition-colors">
              <h3 className="font-bold mb-2">Pro Tip</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Break down complex medical topics into smaller, 5-10 minute modules to keep learners engaged.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
