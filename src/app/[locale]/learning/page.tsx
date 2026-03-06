'use client';

import React from 'react';
import { Loader2, ChevronLeft } from 'lucide-react';
import { useLearning } from '@/hooks/useLearning';
import { LearningPathCard } from '@/components/learning/LearningPathCard';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import ScrollToTop from '@/components/common/ScrollToTop';

export default function LearningPage() {
  const t = useTranslations('learningPage');
  const router = useRouter();
  const { allPaths, recommendedPaths, loading, offlinePaths } = useLearning();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden">
      {/* Theme Magic Background Elements */}
      <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-400/5 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-400/5 dark:bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-700" />

      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{t('title')}</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium text-lg">
            {t('subtitle')}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">{t('loading')}</p>
          </div>
        ) : (
          <div className="space-y-16">
            {recommendedPaths.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-wider">{t('recommended')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

            <section>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-wider">{t('allCourses')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          </div>
        )}
      </div>
    </div>
  );
}
