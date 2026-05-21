'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { LearningPathCard } from './LearningPathCard';

export function EnrolledPathsSection({ 
  paths, 
  offlinePaths, 
  title, 
  onExplore 
}: { 
  paths: any[], 
  offlinePaths: string[], 
  title: string, 
  onExplore: () => void 
}) {
  return (
    <section className="space-y-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest shrink-0">{title}</h2>
        <div className="h-px w-full bg-gradient-to-r from-blue-600/20 to-transparent" />
      </div>
      {paths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {paths.map((path, index) => (
            <LearningPathCard 
              key={path.id} 
              path={path} 
              index={index} 
              isOffline={offlinePaths.includes(path.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Bookmark size={40} />
          </div>
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Course Directory</span>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Start your first health course from our course directory.</p>
          <button 
            onClick={onExplore}
            className="px-8 py-4 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
          >
            Explore Courses
          </button>
        </div>
      )}
    </section>
  );
}

export function AllPathsSection({ 
  allPaths, 
  recommendedPaths, 
  offlinePaths, 
  t 
}: { 
  allPaths: any[], 
  recommendedPaths: any[], 
  offlinePaths: string[], 
  t: any 
}) {
  return (
    <>
      {recommendedPaths.length > 0 && (
        <section className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest shrink-0">{t('recommended')}</h2>
            <div className="h-px w-full bg-gradient-to-r from-blue-600/20 to-transparent" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {recommendedPaths.map((path, index) => (
              <LearningPathCard 
                key={path.id} 
                path={path} 
                index={index} 
                isOffline={offlinePaths.includes(path.id)} 
              />
            ))}
          </div>
        </section>
      )}

      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest shrink-0">{t('allCourses')}</h2>
          <div className="h-px w-full bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {allPaths.map((path, index) => (
            <LearningPathCard 
              key={path.id} 
              path={path} 
              index={index} 
              isOffline={offlinePaths.includes(path.id)} 
            />
          ))}
        </div>
      </section>
    </>
  );
}
