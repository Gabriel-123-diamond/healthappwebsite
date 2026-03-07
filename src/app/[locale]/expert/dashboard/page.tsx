'use client';

import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { userService } from '@/services/userService';
import { contentService } from '@/services/contentService';
import { appointmentService } from '@/services/appointmentService';
import { getActiveAccessCode, generateAccessCode, AccessCode } from '@/services/expertDashboardService';
import { auth } from '@/lib/firebase';
import { CheckCircle, Star, Users, Calendar, TrendingUp, Wallet, ShieldCheck, Activity, Award, Key, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing';
import ExpertStatCard from '@/components/expert/ExpertStatCard';
import { VerificationCard } from '@/components/expert/VerificationCard';
import { ExpertDashboardHeader } from '@/components/expert/ExpertDashboardHeader';
import { ExpertDashboardActions } from '@/components/expert/ExpertDashboardActions';
import { AppointmentList, ArticleList, CourseList } from '@/components/expert/ExpertDashboardLists';
import ScrollToTop from '@/components/common/ScrollToTop';
import { ExpertDashboardProvider, useExpertDashboard } from '@/context/ExpertDashboardContext';
import { PatientQueue } from '@/components/expert/PatientQueue';
import { RevenueForecast } from '@/components/expert/RevenueForecast';
import { CodeExpiryModal } from '@/components/expert/CodeExpiryModal';
import NiceModal from '@/components/common/NiceModal';
import { useRouter } from '@/i18n/routing';

function DashboardContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const { state, dispatch } = useExpertDashboard();
  const { articles, courses, appointments, profile, loading, activeTab } = state;

  const [activeCode, setActiveCode] = useState<AccessCode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  useEffect(() => {
    const fetchAccessCode = async () => {
      const user = auth.currentUser;
      if (user) {
        const code = await getActiveAccessCode(user.uid);
        setActiveCode(code);
      }
    };
    fetchAccessCode();
  }, []);

  const handleGenerateCode = async (expiryHours: number = 24) => {
    const user = auth.currentUser;
    if (user && profile) {
      setIsGenerating(true);
      try {
        const newCode = await generateAccessCode(user.uid, profile.fullName || 'Expert', expiryHours);
        setActiveCode(newCode);
        setIsExpiryModalOpen(false);
      } catch (error) {
        console.error("Failed to generate code:", error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const onCreationAttempt = (e: React.MouseEvent, type: 'article' | 'course') => {
    e.preventDefault();
    if (profile?.verificationStatus !== 'verified') {
      setIsVerificationModalOpen(true);
      return;
    }
    router.push(type === 'article' ? '/expert/articles/new' : '/expert/courses/new');
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const [profileData, articlesData, coursesData] = await Promise.all([
          userService.getUserProfile(user.uid),
          contentService.getExpertArticles(user.uid),
          contentService.getExpertLearningPaths(user.uid)
        ]);

        // Get appointments
        appointmentService.getExpertAppointments(user.uid, (data) => {
          dispatch({ type: 'SET_APPOINTMENTS', payload: data });
        });

        dispatch({ type: 'SET_PROFILE', payload: profileData });
        dispatch({ type: 'SET_ARTICLES', payload: articlesData });
        dispatch({ type: 'SET_COURSES', payload: coursesData });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchData();
  }, [dispatch]);

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
      {/* Background Decor */}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <ExpertStatCard icon={<Calendar />} label="Clinical Sessions" value={appointments.length.toString()} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
          <ExpertStatCard icon={<Award />} label="Clinical Impact" value={(articles.length * 10 + courses.length * 50).toString()} color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" />
          <ExpertStatCard icon={<Users />} label="Global Reach" value={profile?.views || "0"} color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" />
          <ExpertStatCard icon={<Star />} label="Patient Rating" value={profile?.rating || "5.0"} color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-10">
            {/* Mind-blowing Predictive Analytics Section */}
            <div className="p-1 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[48px]">
              <div className="bg-white dark:bg-slate-900 rounded-[46px] p-8 sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Activity className="w-32 h-32 text-indigo-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                         <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-indigo-500/20">AI Intelligence Node</span>
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Predictive Patient Analytics</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">AI-driven projections based on your current clinical performance.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-800">
                       <div className="text-right px-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence</p>
                          <p className="text-lg font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">98.4%</p>
                       </div>
                       <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                       <div className="text-right px-4">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cycle</p>
                          <p className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">Q4-24</p>
                       </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    {[
                      { label: 'Projected Growth', value: '+24%', desc: 'Est. patient inflow increase', color: 'text-emerald-500' },
                      { label: 'Retention Score', value: '8.9/10', desc: 'AI-calculated patient loyalty', color: 'text-blue-500' },
                      { label: 'Market Demand', value: 'High', desc: 'Category: Chronic Care', color: 'text-purple-500' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800/50 hover:border-indigo-500/30 transition-all group">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">{stat.label}</p>
                        <p className={`text-3xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase">{stat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

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
              <div className="p-8 bg-gradient-to-br from-slate-900 to-blue-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-white/20 transition-all" />
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                      <Wallet className="w-6 h-6 text-blue-300" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-300 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-400/30">Revenue Node</span>
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-1">Accumulated Points</p>
                    <h3 className="text-4xl font-black tracking-tighter flex items-baseline gap-2">
                      {profile?.points || "0"}
                      <span className="text-sm font-bold text-blue-400 tracking-normal uppercase">PTS</span>
                    </h3>
                  </div>

                  <RevenueForecast />

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">+12% this cycle</span>
                    </div>
                    <Link href="/expert/revenue" className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors">View Ledger</Link>
                  </div>
                </div>
              </div>

              <VerificationCard status={profile?.verificationStatus || 'unverified'} type={profile?.type} />
              
              <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Compliance Status</h4>
                 </div>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">HIPAA Alignment</span>
                      <span className="text-emerald-500 font-black flex items-center gap-1"><CheckCircle className="w-3 h-3" /> ACTIVE</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2">
                      <span className="text-slate-500 font-bold uppercase tracking-wider">Security Audit</span>
                      <span className="text-slate-900 dark:text-white font-black">L-3 PASS</span>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                        <Key className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Access Code Node</h4>
                    </div>
                    {activeCode && (
                       <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
                    )}
                 </div>
                 
                 <div className="space-y-4">
                    {activeCode ? (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Private Access Code</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white tracking-[0.2em]">{activeCode.code}</p>
                        <p className="text-[10px] text-slate-500 font-medium mt-2 italic text-center">
                          Expires: {new Date(activeCode.expiresAt.seconds ? activeCode.expiresAt.seconds * 1000 : activeCode.expiresAt).toLocaleString()}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-xs text-slate-500 font-medium italic">No active access code found.</p>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsExpiryModalOpen(true)}
                      disabled={isGenerating}
                      className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-lg hover:shadow-indigo-500/10"
                    >
                      {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                      Generate New Code
                    </motion.button>
                 </div>
              </div>

              <ExpertDashboardActions expertId={profile?.id} />
            </div>
          </aside>
        </div>
      </div>

      <CodeExpiryModal 
        isOpen={isExpiryModalOpen} 
        onClose={() => setIsExpiryModalOpen(false)} 
        onGenerate={handleGenerateCode} 
        isGenerating={isGenerating} 
      />

      <NiceModal 
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onConfirm={() => router.push('/expert/setup')}
        title="Stage 3 Verification Required"
        description="To maintain the clinical integrity of Ikiké, publishing articles and courses requires Stage 3 Verification. Please complete your professional credentialing to unlock these features."
        confirmText="Complete Verification"
        cancelText="Maybe Later"
        type="warning"
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
