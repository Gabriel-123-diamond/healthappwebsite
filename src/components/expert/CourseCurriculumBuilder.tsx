'use client';

import React, { useState } from 'react';
import { Module, Lesson } from '@/types/learning';
import { CurriculumSidebar } from './studio/CurriculumSidebar';
import { LessonEditor } from './studio/LessonEditor';

interface CourseCurriculumBuilderProps {
  modules: Module[];
  setModules: (modules: Module[]) => void;
}

export const CourseCurriculumBuilder: React.FC<CourseCurriculumBuilderProps> = ({
  modules,
  setModules,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(modules[0]?.id || null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(modules[0]?.lessons[0]?.id || null);

  const activeModule = modules.find(m => m.id === selectedModuleId);
  const activeLesson = activeModule?.lessons.find(l => l.id === selectedLessonId);

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: 'New Clinical Module',
      lessons: [],
    };
    setModules([...modules, newModule]);
    setSelectedModuleId(newModule.id);
  };

  const addLesson = (moduleId: string) => {
    const newLessonId = (Date.now() + 1).toString();
    setModules(modules.map(m => {
      if (m.id === moduleId) {
        return {
          ...m,
          lessons: [
            ...m.lessons,
            { id: newLessonId, title: 'New Learning Node', duration: '10m', type: 'article' }
          ]
        };
      }
      return m;
    }));
    setSelectedLessonId(newLessonId);
  };

  const updateLesson = (updates: Partial<Lesson>) => {
    if (!selectedModuleId || !selectedLessonId) return;
    setModules(modules.map(m => {
      if (m.id === selectedModuleId) {
        return {
          ...m,
          lessons: m.lessons.map(l => l.id === selectedLessonId ? { ...l, ...updates } : l)
        };
      }
      return m;
    }));
  };

  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null);
      setSelectedLessonId(null);
    }
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
    if (selectedLessonId === lessonId) setSelectedLessonId(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
      <div className="lg:col-span-4 flex flex-col gap-6">
        <CurriculumSidebar
          modules={modules}
          setModules={setModules}
          selectedModuleId={selectedModuleId}
          setSelectedModuleId={setSelectedModuleId}
          selectedLessonId={selectedLessonId}
          setSelectedLessonId={setSelectedLessonId}
          addModule={addModule}
          addLesson={addLesson}
          deleteModule={deleteModule}
          deleteLesson={deleteLesson}
        />
      </div>
      <LessonEditor
        activeLesson={activeLesson}
        updateLesson={updateLesson}
      />
    </div>
  );
};
