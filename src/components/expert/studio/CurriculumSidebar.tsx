'use client';

import React from 'react';
import { Plus, Trash2, PlayCircle, FileText } from 'lucide-react';
import { Module } from '@/types/learning';
import { motion, AnimatePresence } from 'framer-motion';

interface CurriculumSidebarProps {
  modules: Module[];
  setModules: (modules: Module[]) => void;
  selectedModuleId: string | null;
  setSelectedModuleId: (id: string | null) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  addModule: () => void;
  addLesson: (moduleId: string) => void;
  deleteModule: (moduleId: string) => void;
  deleteLesson: (moduleId: string, lessonId: string) => void;
}

export const CurriculumSidebar: React.FC<CurriculumSidebarProps> = ({
  modules,
  setModules,
  selectedModuleId,
  setSelectedModuleId,
  selectedLessonId,
  setSelectedLessonId,
  addModule,
  addLesson,
  deleteModule,
  deleteLesson,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col h-[700px]">
      <div className="p-8 border-b border-slate-50 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
        <div>
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Curriculum Tree</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{modules.length} Modules Active</p>
        </div>
        <button
          onClick={addModule}
          className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {modules.map((module, mIdx) => (
          <div key={module.id} className="space-y-2">
            <div 
              onClick={() => setSelectedModuleId(module.id)}
              className={`p-4 rounded-2xl flex items-center justify-between group cursor-pointer transition-all ${
                selectedModuleId === module.id 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500/50' 
                  : 'bg-white dark:bg-slate-800 border-2 border-transparent hover:border-slate-100 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-[10px] font-black">
                  {mIdx + 1}
                </div>
                <input
                  className="bg-transparent font-bold text-sm text-slate-900 dark:text-white outline-none w-full"
                  value={module.title}
                  onChange={(e) => {
                    const newModules = [...modules];
                    newModules[mIdx].title = e.target.value;
                    setModules(newModules);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteModule(module.id); }}
                className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <AnimatePresence>
              {selectedModuleId === module.id && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pl-6 space-y-2 overflow-hidden"
                >
                  {module.lessons.map((lesson) => (
                    <div 
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`p-3 rounded-xl flex items-center justify-between group cursor-pointer border transition-all ${
                        selectedLessonId === lesson.id 
                          ? 'bg-white dark:bg-slate-800 border-blue-500 shadow-lg' 
                          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {lesson.type === 'video' ? <PlayCircle size={14} className="text-blue-500" /> : <FileText size={14} className="text-emerald-500" />}
                        <span className={`text-xs font-bold truncate max-w-[150px] ${selectedLessonId === lesson.id ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                          {lesson.title}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteLesson(module.id, lesson.id); }}
                        className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addLesson(module.id)}
                    className="w-full py-2 border-2 border-dashed border-slate-100 dark:border-white/5 rounded-xl text-[10px] font-black text-slate-400 hover:text-blue-600 hover:border-blue-500/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={12} />
                    Add Node
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};
