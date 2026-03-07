'use client';

import React from 'react';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { Module, Lesson } from '@/types/learning';

interface CourseCurriculumBuilderProps {
  modules: Module[];
  setModules: (modules: Module[]) => void;
}

export const CourseCurriculumBuilder: React.FC<CourseCurriculumBuilderProps> = ({
  modules,
  setModules,
}) => {
  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: 'New Module',
      lessons: [],
    };
    setModules([...modules, newModule]);
  };

  const addLesson = (moduleId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [
            ...m.lessons,
            { id: Date.now().toString(), title: 'New Lesson', duration: '10m', type: 'article' }
          ]
        };
      }
      return m;
    }));
  };

  const updateLesson = (moduleId: string, lessonId: string, updates: Partial<Lesson>) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updates } : l)
        };
      }
      return m;
    }));
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: m.lessons.filter(l => l.id !== lessonId)
        };
      }
      return m;
    }));
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ChevronRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Course Curriculum
        </h2>
        <button
          onClick={addModule}
          className="px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </button>
      </div>

      <div className="space-y-6">
        {modules.map((module, mIdx) => (
          <div key={module.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between mb-4">
              <input
                className="bg-transparent font-bold text-slate-900 dark:text-white outline-none focus:text-blue-600 dark:text-blue-400 transition-colors w-full"
                value={module.title}
                onChange={(e) => {
                  const newModules = [...modules];
                  newModules[mIdx].title = e.target.value;
                  setModules(newModules);
                }}
              />
              <button onClick={() => deleteModule(module.id)} className="text-red-400 hover:text-red-600 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              {module.lessons.map((lesson) => (
                <div key={lesson.id} className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 flex gap-4">
                  <div className="flex-grow space-y-2">
                    <input
                      className="text-sm font-medium text-slate-900 dark:text-white bg-transparent outline-none w-full"
                      value={lesson.title}
                      onChange={(e) => updateLesson(module.id, lesson.id, { title: e.target.value })}
                    />
                    <div className="flex gap-4">
                      <select
                        value={lesson.type}
                        onChange={(e) => updateLesson(module.id, lesson.id, { type: e.target.value as any })}
                        className="text-xs bg-transparent border-none outline-none text-slate-500"
                      >
                        <option value="article">Article</option>
                        <option value="video">Video</option>
                        <option value="quiz">Quiz</option>
                      </select>
                      <input
                        className="text-xs text-slate-500 bg-transparent border-none outline-none"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(module.id, lesson.id, { duration: e.target.value })}
                        placeholder="Duration (e.g. 10m)"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteLesson(module.id, lesson.id)}
                    className="text-slate-300 hover:text-red-400 transition-colors self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addLesson(module.id)}
                className="text-xs font-medium text-slate-400 hover:text-blue-500 flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add Lesson
              </button>
            </div>
          </div>
        ))}
        
        {modules.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">No modules added yet. Start by adding a module to your course.</p>
          </div>
        )}
      </div>
    </div>
  );
};
