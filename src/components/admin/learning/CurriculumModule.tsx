import React from 'react';
import { Trash2, Plus } from 'lucide-react';
import { Module, Lesson } from '@/services/learningService';

interface CurriculumModuleProps {
  module: Module;
  index: number;
  updateModuleTitle: (index: number, val: string) => void;
  removeModule: (index: number) => void;
  addLesson: (moduleIndex: number) => void;
  removeLesson: (moduleIndex: number, lessonIndex: number) => void;
  updateLesson: (moduleIndex: number, lessonIndex: number, field: keyof Lesson, val: string) => void;
}

export function CurriculumModule({
  module,
  index: mIdx,
  updateModuleTitle,
  removeModule,
  addLesson,
  removeLesson,
  updateLesson,
}: CurriculumModuleProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden transition-colors">
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
  );
}
