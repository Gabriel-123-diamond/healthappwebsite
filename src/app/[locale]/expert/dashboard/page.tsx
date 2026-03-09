'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerificationCard } from '@/components/expert/VerificationCard';
import { ExpertDashboardHeader } from '@/components/expert/ExpertDashboardHeader';
import { ExpertDashboardActions } from '@/components/expert/ExpertDashboardActions';
import { AppointmentList, ArticleList, CourseList } from '@/components/expert/ExpertDashboardLists';
import ScrollToTop from '@/components/common/ScrollToTop';
import { ExpertDashboardProvider } from '@/context/ExpertDashboardContext';
import { PatientQueue } from '@/components/expert/PatientQueue';
import { useRouter } from '@/i18n/routing';

// New Modular Components
import { PredictiveAnalytics } from '@/components/expert/dashboard/PredictiveAnalytics';
import { FinancialCoreCard } from '@/components/expert/dashboard/FinancialCoreCard';
import { ComplianceStatusCard } from '@/components/expert/dashboard/ComplianceStatusCard';
import { AccessCodeNode } from '@/components/expert/dashboard/AccessCodeNode';
import { ExpertStatsGrid } from '@/components/expert/dashboard/ExpertStatsGrid';
import { DashboardModals } from '@/components/expert/dashboard/DashboardModals';
import { useDashboardData } from './hooks/useDashboardData';

function DashboardContent() {
  const router = useRouter();
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  const {
    state,
    dispatch,
    accessCodes,
    loadingCodes,
    isGenerating,
    modalConfig,
    setModalConfig,
    confirmConfig,
    setConfirmConfig,
    handleGenerateCode,
    handleDeleteCode,
  } = useDashboardData();

  const { articles, courses, appointments, profile, loading, activeTab } = state;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const onCreationAttempt = (e: React.MouseEvent, type: 'article' | 'course') => {
    e.preventDefault();
    if (profile?.verificationStatus !== 'verified') {
      setIsVerificationModalOpen(true);
      return;
    }
    router.push(type === 'article' ? '/expert/articles/new' : '/expert/courses/new');
  };

  if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
         <Activity className="w-12 h-12 text-indigo-600 animate-pulse" />
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <ScrollToTop />
      <div className="fixed inset-0 pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="mb-12">
          <ExpertDashboardHeader 
            verificationStatus={profile?.verificationStatus} 
            onCreationAttempt={onCreationAttempt} 
          />
        </div>

        <ExpertStatsGrid 
          appointmentsCount={appointments.length}
          articlesCount={articles.length}
          coursesCount={courses.length}
          views={profile?.views || "0"}
          rating={profile?.rating || "5.0"}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            <PredictiveAnalytics />

            <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-800 shadow-sm w-fit overflow-x-auto max-w-full">
              {(['appointments', 'queue', 'articles', 'courses'] as const).map(tab => (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={tab} 
                  onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
                      : 'text-slate-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                  }`}
                >
                  {tab === 'appointments' ? 'Consultations' : tab === 'queue' ? 'Live Triage' : tab === 'articles' ? 'Medical Records' : 'Curricula'}
                </motion.button>
              ))}
            </div>

            <section className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-3xl shadow-blue-900/5 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'appointments' ? (
                    <AppointmentList appointments={appointments} />
                  ) : activeTab === 'queue' ? (
                    <PatientQueue />
                  ) : activeTab === 'articles' ? (
                    <ArticleList articles={articles} onCreationAttempt={onCreationAttempt} />
                  ) : (
                    <CourseList courses={courses} onCreationAttempt={onCreationAttempt} />
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              <FinancialCoreCard points={profile?.points} />
              <VerificationCard status={profile?.verificationStatus || 'unverified'} type={profile?.type} />
              <ComplianceStatusCard />
              <AccessCodeNode 
                accessCodes={accessCodes}
                loadingCodes={loadingCodes}
                isGenerating={isGenerating}
                onDeleteCode={handleDeleteCode}
                onCopyCode={handleCopyCode}
                onOpenExpiryModal={() => setIsExpiryModalOpen(true)}
              />
              <ExpertDashboardActions expertId={profile?.id} />
            </div>
          </aside>
        </div>
      </div>

      <DashboardModals 
        isExpiryModalOpen={isExpiryModalOpen}
        setIsExpiryModalOpen={setIsExpiryModalOpen}
        isVerificationModalOpen={isVerificationModalOpen}
        setIsVerificationModalOpen={setIsVerificationModalOpen}
        isGenerating={isGenerating}
        handleGenerateCode={handleGenerateCode}
        modalConfig={modalConfig}
        setModalConfig={setModalConfig}
        confirmConfig={confirmConfig}
        setConfirmConfig={setConfirmConfig}
      />
    </div>
  );
}

export default function ExpertDashboard() {
  return (
    <ExpertDashboardProvider>
      <DashboardContent />
    </ExpertDashboardProvider>
  );
}
