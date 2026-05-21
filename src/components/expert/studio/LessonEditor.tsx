'use client';

import React from 'react';
import { PlayCircle, FileText, Edit3, Clock, Layout, CheckCircle2 } from 'lucide-react';
import { Lesson } from '@/types/learning';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonEditorProps {
  activeLesson: Lesson | undefined;
  updateLesson: (updates: Partial<Lesson>) => void;
  isDark?: boolean;
}

export const LessonEditor: React.FC<LessonEditorProps> = ({
  activeLesson,
  updateLesson,
  isDark,
}) => {
  return (
    <div className="lg:col-span-8">
      <AnimatePresence mode="wait">
        {activeLesson ? (
          <motion.div
            key={activeLesson.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-2xl space-y-8 h-full min-h-[700px]"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-8 border-b border-slate-50 dark:border-white/5">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${activeLesson.type === 'video' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                  {activeLesson.type === 'video' ? <PlayCircle size={24} /> : <FileText size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Lesson Editor</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Configuring {activeLesson.title}</p>
                </div>
              </div>

              <div className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
                {(['article', 'video'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => updateLesson({ type })}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeLesson.type === type 
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-2">
                  <Edit3 size={12} /> Lesson Title
                </label>
                <input
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-900 dark:text-white"
                  value={activeLesson.title}
                  onChange={(e) => updateLesson({ title: e.target.value })}
                  placeholder="e.g. Fundamental Herbal Protocols"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-2">
                  <Clock size={12} /> Estimated Duration
                </label>
                <input
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-900 dark:text-white"
                  value={activeLesson.duration}
                  onChange={(e) => updateLesson({ duration: e.target.value })}
                  placeholder="e.g. 15m"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <Layout size={12} /> Content Payload
                </label>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {activeLesson.type === 'video' ? 'YouTube/Vimeo Embed' : 'Markdown Enabled'}
                </span>
              </div>

              {activeLesson.type === 'video' ? (
                <div className="space-y-4">
                  <input
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-bold text-slate-900 dark:text-white font-mono text-xs"
                    placeholder="https://www.youtube.com/embed/..."
                    value={activeLesson.videoUrl || ''}
                    onChange={(e) => updateLesson({ videoUrl: e.target.value })}
                  />
                  <div className="aspect-video rounded-[32px] bg-slate-900 border border-white/5 flex items-center justify-center overflow-hidden group">
                    {activeLesson.videoUrl ? (
                      <iframe src={activeLesson.videoUrl} className="w-full h-full" />
                    ) : (
                      <div className="text-center space-y-4">
                        <PlayCircle size={48} className="mx-auto text-slate-700 group-hover:text-blue-500 transition-colors" />
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Video Preview Hub</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <textarea
                  className="w-full px-8 py-8 rounded-[32px] bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500/50 focus:bg-white dark:focus:bg-slate-900 outline-none transition-all font-medium text-slate-700 dark:text-slate-300 min-h-[400px] leading-relaxed"
                  placeholder="Write elite clinical content here. Support for Markdown (# Header, **bold**, - lists)."
                  value={activeLesson.content || ''}
                  onChange={(e) => updateLesson({ content: e.target.value })}
                />
              )}
            </div>

            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
              <p className="text-[10px] text-blue-700 dark:text-blue-400 font-bold uppercase tracking-widest">Auto-sync active: Changes are prepared for local publishing.</p>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[40px] p-10 border border-slate-100 dark:border-white/5 shadow-2xl h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
              <Layout className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">No Node Selected</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">Select a lesson from the curriculum tree on the left to begin editing clinical content.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
