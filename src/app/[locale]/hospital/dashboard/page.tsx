'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { institutionService, getInstitutionById } from '@/services/institutionService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from '@/i18n/routing';
import { HospitalStatsGrid } from '@/components/hospital/HospitalStatsGrid';
import { ActionLink } from '@/components/hospital/ActionLink';
import { Users, Megaphone, LayoutGrid, Settings } from 'lucide-react';

// New Modular Components
import { DashboardHeader } from '@/components/hospital/dashboard/DashboardHeader';
import { GlobalTriageWidget } from '@/components/hospital/dashboard/GlobalTriageWidget';
import { ResourceAllocationWidget } from '@/components/hospital/dashboard/ResourceAllocationWidget';
import { StaffOverviewWidget } from '@/components/hospital/dashboard/StaffOverviewWidget';
import { DepartmentalAnalyticsWidget } from '@/components/hospital/dashboard/DepartmentalAnalyticsWidget';

export default function HospitalDashboard() {
  const [loading, setLoading] = useState(true);
  const [institution, setInstitution] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [erStatus, setErStatus] = useState<'OPEN' | 'CLOSED'>('OPEN');
  const [resources, setResources] = useState<any[]>([
    { id: 'beds', label: 'General Beds', available: 45, total: 50, color: 'bg-blue-500' },
    { id: 'icu', label: 'ICU Beds', available: 4, total: 5, color: 'bg-indigo-500' },
    { id: 'vents', label: 'Ventilators', available: 12, total: 15, color: 'bg-emerald-500' },
  ]);
  const router = useRouter();
  const t = useTranslations('hospitalDashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        const instData = await getInstitutionById(user.uid);
        if (!instData) {
          router.push('/hospital/setup');
          return;
        }
        setInstitution(instData);
        if (instData.erStatus) setErStatus(instData.erStatus as any);
        if (instData.resources && instData.resources.length > 0) {
          setResources(instData.resources);
        }

        const [staffData, appointmentsData] = await Promise.all([
          institutionService.getStaff(user.uid),
          institutionService.getInstitutionalAppointments(user.uid)
        ]);

        setStaff(staffData || []);
        setAppointments(appointmentsData || []);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleUpdateResources = async (updatedResources: any[]) => {
    if (!institution?.id) return;
    setResources(updatedResources);
    try {
      await institutionService.updateResources(institution.id, updatedResources);
    } catch (error) {
      console.error("Failed to update resources:", error);
    }
  };

  const handleUpdateErStatus = async (status: 'OPEN' | 'CLOSED') => {
    if (!institution?.id) return;
    setErStatus(status);
    try {
      await institutionService.updateErStatus(institution.id, status);
    } catch (error) {
      console.error("Failed to update ER status:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] pt-32 sm:pt-40 pb-24 px-4 sm:px-6 relative overflow-hidden">
      {/* High-tech Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="max-w-[1600px] mx-auto space-y-10 relative z-10">
        {/* Header Section - Control Panel Style */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 bg-[#0B1221]/50 backdrop-blur-xl border border-white/5 p-8 rounded-[32px]">
          <DashboardHeader t={t} institutionName={institution?.name} />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full xl:w-auto">
            <ActionLink href="/hospital/staff" icon={Users} label="Staff Nodes" />
            <ActionLink href="/hospital/promote" icon={Megaphone} label="Promotions" />
            <ActionLink href="/hospital/departments" icon={LayoutGrid} label="Departments" />
            <ActionLink href="/hospital/setup" icon={Settings} label="Control Panel" />
          </div>
        </div>

        {/* Stats Grid - High Density */}
        <HospitalStatsGrid 
          t={t}
          staffCount={staff.length}
          appointmentsCount={appointments.length}
          isVerified={institution?.verified}
        />

        {/* Main Command Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Central Operations (Triage & Analytics) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <GlobalTriageWidget t={t} appointments={appointments} erStatus={erStatus} />
              <div className="space-y-8">
                <DepartmentalAnalyticsWidget />
                <div className="bg-[#0B1221]/50 backdrop-blur-xl rounded-[40px] border border-white/5 p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Live Status</h4>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">System Active</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'OPD Throughput', val: '94%', color: 'bg-emerald-500' },
                      { label: 'Resource Load', val: '62%', color: 'bg-indigo-500' },
                      { label: 'Net Efficiency', val: '88%', color: 'bg-blue-500' }
                    ].map(s => (
                      <div key={s.label} className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                          <span>{s.label}</span>
                          <span className="text-white">{s.val}</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full ${s.color}`} style={{ width: s.val }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lateral Support (Staff & Resources) */}
          <div className="lg:col-span-4 space-y-8">
            <ResourceAllocationWidget 
              resources={resources} 
              setResources={handleUpdateResources} 
              erStatus={erStatus} 
              setErStatus={handleUpdateErStatus} 
            />
            <StaffOverviewWidget t={t} staff={staff} />
          </div>
        </div>
      </div>
    </div>
  );
}
