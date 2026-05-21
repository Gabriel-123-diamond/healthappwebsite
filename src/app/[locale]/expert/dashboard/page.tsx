'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { VerificationCard } from '@/components/expert/VerificationCard';
import { ExpertDashboardHeader } from '@/components/expert/ExpertDashboardHeader';
import { ExpertDashboardActions } from '@/components/expert/ExpertDashboardActions';
import ScrollToTop from '@/components/common/ScrollToTop';
import { ExpertDashboardProvider } from '@/context/ExpertDashboardContext';
import { useRouter } from '@/i18n/routing';
import { ActiveTabContent } from './components/ActiveTabContent';
import { PredictiveAnalytics } from '@/components/expert/dashboard/PredictiveAnalytics';
import { FinancialCoreCard } from '@/components/expert/dashboard/FinancialCoreCard';
import { ComplianceStatusCard } from '@/components/expert/dashboard/ComplianceStatusCard';
import { AccessCodeNode } from '@/components/expert/dashboard/AccessCodeNode';
import { ExpertStatsGrid } from '@/components/expert/dashboard/ExpertStatsGrid';
import { DashboardModals } from '@/components/expert/dashboard/DashboardModals';
import { UpgradePaymentBanner } from '@/components/expert/dashboard/UpgradePaymentBanner';
import { AiScribeWidget } from '@/components/expert/dashboard/AiScribeWidget';
import { EPrescribingWidget } from '@/components/expert/dashboard/EPrescribingWidget';
import { PeerNetworkWidget } from '@/components/expert/dashboard/PeerNetworkWidget';
import { HolisticProgressWidget } from '@/components/expert/dashboard/HolisticProgressWidget';
import { DigitalDispensaryWidget } from '@/components/expert/dashboard/DigitalDispensaryWidget';
import { CourseCreatorWidget } from '@/components/expert/dashboard/CourseCreatorWidget';
import { ClientJournalWidget } from '@/components/expert/dashboard/ClientJournalWidget';
import { useDashboardData } from './hooks/useDashboardData';
import { TierGate } from '@/components/expert/dashboard/TierGate';

function DashboardContent() {
  const router = useRouter();
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const {
    state, dispatch, accessCodes, loadingCodes, isGenerating, modalConfig, setModalConfig,
    confirmConfig, setConfirmConfig, handleGenerateCode, handleDeleteCode, showAlert, refreshProfile
  } = useDashboardData();

  const { articles, courses, appointments, profile, loading, activeTab } = state;
  const userTier = profile?.tier || 'basic';
  const isDoctor = profile?.role === 'doctor';
  const isWellness = profile?.role === 'wellness_practitioner';

  const isAiScribeLocked = isDoctor && userTier !== 'authority';
  const isEPrescribingLocked = isDoctor && userTier !== 'authority';
  const isPeerNetworkLocked = isDoctor && userTier !== 'authority';
  const isPredictiveAnalyticsLocked = isDoctor && (userTier !== 'professional' && userTier !== 'authority');
  const isSmartTriageLocked = isDoctor && (userTier !== 'professional' && userTier !== 'authority');
  const isHolisticProgressLocked = isWellness && (userTier !== 'vip1' && userTier !== 'vip2');
  const isDigitalDispensaryLocked = isWellness && (userTier !== 'vip1' && userTier !== 'vip2');
  const isClientJournalLocked = isWellness && (userTier !== 'vip1' && userTier !== 'vip2');
  const isCourseCreatorLocked = isWellness && userTier !== 'vip2';

  React.useEffect(() => {
    if (!loading && !profile) router.push('/onboarding');
  }, [loading, profile, router]);

  const onCreationAttempt = () => {
    if (profile?.verificationStatus !== 'verified') {
      setIsVerificationModalOpen(true);
      return false;
    }
    return true;
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showAlert('Success', 'Access code copied to clipboard!', 'success');
  };

  if (loading) {
     return (
       <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
       </div>
     );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {profile?.upgradeStatus === 'pending_payment' && (
          <UpgradePaymentBanner profile={profile} onSuccess={refreshProfile} />
        )}
        <div className="mb-12">
          <ExpertDashboardHeader 
            verificationStatus={profile?.verificationStatus} 
            onCreationAttempt={onCreationAttempt} 
            role={profile?.role}
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
            {profile?.role === 'doctor' && (
              <TierGate isLocked={isAiScribeLocked} featureName="AI Scribe">
                <AiScribeWidget />
              </TierGate>
            )}
            {profile?.role === 'wellness_practitioner' && (
              <TierGate isLocked={isCourseCreatorLocked} featureName="Course Creator">
                <CourseCreatorWidget />
              </TierGate>
            )}
            
            <TierGate isLocked={isPredictiveAnalyticsLocked} featureName="Predictive Analytics">
              <PredictiveAnalytics />
            </TierGate>

            <div className="flex bg-white dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-800 shadow-sm w-fit overflow-x-auto max-w-full">
              {(['appointments', 'kanban', 'queue', 'articles', 'courses'] as const).map(tab => (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={tab} 
                  onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab })} 
                  className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab 
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' 
                      : 'text-slate-400 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-400'
                  }`}
                >
                  {tab === 'appointments' ? 'Appointments' : tab === 'kanban' ? 'Smart Triage' : tab === 'queue' ? 'Patient Queue' : tab === 'articles' ? 'Articles' : 'Courses'}
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
                  <ActiveTabContent
                    activeTab={activeTab}
                    appointments={appointments}
                    articles={articles}
                    courses={courses}
                    isSmartTriageLocked={isSmartTriageLocked}
                    onCreationAttempt={onCreationAttempt}
                  />
                </motion.div>
              </AnimatePresence>
            </section>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32 space-y-8">
              <FinancialCoreCard points={profile?.points} />
              {profile?.role === 'doctor' && (
                <TierGate isLocked={isEPrescribingLocked} featureName="E-Prescribing">
                  <EPrescribingWidget />
                </TierGate>
              )}
              {profile?.role === 'doctor' && (
                <TierGate isLocked={isPeerNetworkLocked} featureName="Peer Network">
                  <PeerNetworkWidget />
                </TierGate>
              )}
              {profile?.role === 'wellness_practitioner' && (
                <TierGate isLocked={isHolisticProgressLocked} featureName="Holistic Progress">
                  <HolisticProgressWidget />
                </TierGate>
              )}
              {profile?.role === 'wellness_practitioner' && (
                <TierGate isLocked={isDigitalDispensaryLocked} featureName="Digital Dispensary">
                  <DigitalDispensaryWidget />
                </TierGate>
              )}
              {profile?.role === 'wellness_practitioner' && (
                <TierGate isLocked={isClientJournalLocked} featureName="Client Journal">
                  <ClientJournalWidget />
                </TierGate>
              )}
              <VerificationCard status={profile?.verificationStatus || 'unverified'} type={profile?.type} tier={profile?.tier} />
              <ComplianceStatusCard />
              <AccessCodeNode 
                accessCodes={accessCodes}
                loadingCodes={loadingCodes}
                isGenerating={isGenerating}
                onDeleteCode={handleDeleteCode}
                onCopyCode={handleCopyCode}
                onOpenExpiryModal={() => setIsExpiryModalOpen(true)}
              />
              <ExpertDashboardActions expertId={profile?.uid} />
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
      <ScrollToTop />
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
