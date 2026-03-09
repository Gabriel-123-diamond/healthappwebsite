'use client';

import React from 'react';
import { ArrowLeft, Plus, Save, Loader2, BookOpen, Activity, Leaf, Moon, Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';
import NiceModal from '@/components/common/NiceModal';
import { useCreateLearningPath } from '@/hooks/useCreateLearningPath';
import { CurriculumModule } from '@/components/admin/learning/CurriculumModule';

export default function CreateLearningPathPage() {
  const {
    authLoading,
    loading,
    modalConfig,
    setModalConfig,
    title,
    setTitle,
    description,
    setDescription,
    category,
    setCategory,
    icon,
    setIcon,
    modules,
    addModule,
    removeModule,
    updateModuleTitle,
    addLesson,
    removeLesson,
    updateLesson,
    handleSave,
  } = useCreateLearningPath();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors pt-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 sticky top-16 z-10 transition-colors">
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
                <CurriculumModule 
                  key={module.id}
                  module={module}
                  index={mIdx}
                  updateModuleTitle={updateModuleTitle}
                  removeModule={removeModule}
                  addLesson={addLesson}
                  removeLesson={removeLesson}
                  updateLesson={updateLesson}
                />
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

      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText="Got it"
      />
    </div>
  );
}
