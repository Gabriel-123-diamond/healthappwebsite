'use client';

import React, { Suspense } from 'react';
import { Loader2, GraduationCap, Bookmark } from 'lucide-react';
import { useLearning } from '@/hooks/useLearning';
import { LearningPathSkeleton } from '@/components/learning/LearningPathSkeleton';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import ScrollToTop from '@/components/common/ScrollToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BackgroundGlow, 
  NavigationHeader, 
  PageHeader, 
  TabButton, 
  LearningStats 
} from '@/components/learning/LearningHeader';
import { 
  EnrolledPathsSection, 
  AllPathsSection 
} from '@/components/learning/LearningSections';

function LearningContent() {
  const t = useTranslations('learningPage');
  const commonT = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'all';
  
  const { allPaths, recommendedPaths, enrolledPaths, loading, offlinePaths } = useLearning();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const handleTabChange = (tab: string) => {
    router.push(`/learning?tab=${tab}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500 relative overflow-hidden">
      <BackgroundGlow />

      <div className="max-w-7xl mx-auto relative z-10">
        <NavigationHeader onBack={() => router.back()} />
        
        <PageHeader title={t('title')} subtitle={t('subtitle')} />

        <div className="flex items-center justify-center mb-16 relative">
          <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-1">
            <TabButton 
              active={activeTab === 'all'} 
              onClick={() => handleTabChange('all')}
              icon={<GraduationCap size={14} />}
              label={commonT('browseCourses')}
            />
            <TabButton 
              active={activeTab === 'enrolled'} 
              onClick={() => handleTabChange('enrolled')}
              icon={<Bookmark size={14} />}
              label={commonT('myEnrollments')}
            />
          </div>
        </div>

        <LearningStats />

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingState />
          ) : (
            <motion.div 
              key={`${activeTab}-content`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-24"
            >
              {activeTab === 'enrolled' ? (
                <EnrolledPathsSection 
                  paths={enrolledPaths} 
                  offlinePaths={offlinePaths} 
                  title={commonT('myEnrollments')}
                  onExplore={() => handleTabChange('all')}
                />
              ) : (
                <AllPathsSection 
                  allPaths={allPaths} 
                  recommendedPaths={recommendedPaths} 
                  offlinePaths={offlinePaths}
                  t={t}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ScrollToTop />
    </div>
  );
}

function LoadingState() {
  return (
    <motion.div 
      key="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-24 w-full"
    >
      <section className="space-y-10">
        <div className="flex items-center gap-4">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-px w-full bg-gradient-to-r from-slate-200 dark:from-white/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {[1, 2, 3].map((i) => (
            <LearningPathSkeleton key={i} />
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default function LearningPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    }>
      <LearningContent />
    </Suspense>
  );
}
