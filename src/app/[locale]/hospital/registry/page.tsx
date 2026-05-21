'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  ClipboardList, Search, Filter, ArrowLeft, 
  Loader2, User, Calendar, Clock, CheckCircle2,
  AlertCircle, ChevronRight, Activity, Shield,
  LayoutGrid, List, MapPin, Pill, CheckCircle
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth, db } from '@/lib/firebase';
import { institutionService } from '@/services/institutionService';
import { doc, updateDoc } from 'firebase/firestore';
import { RegistryKanbanView, type TriageStatus, type RegistryAppointment } from '@/components/institution/RegistryKanbanView';
import { RegistryListView } from '@/components/institution/RegistryListView';

export default function InstitutionalRegistryPage() {
  const [appointments, setAppointments] = useState<RegistryAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const data = await institutionService.getInstitutionalAppointments(user.uid);
        // Default triage status if missing
        const enrichedData = data.map(apt => ({
          ...apt,
          triageStatus: apt.triageStatus || (apt.status === 'completed' ? 'discharged' : 'scheduled')
        }));
        setAppointments(enrichedData as RegistryAppointment[]);
      } catch (error) {
        console.error("Failed to fetch registry:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTriageUpdate = async (aptId: string, newStatus: TriageStatus) => {
    try {
      await updateDoc(doc(db, 'appointments', aptId), {
        triageStatus: newStatus,
        updatedAt: new Date().toISOString()
      });
      setAppointments(prev => prev.map(a => a.id === aptId ? { ...a, triageStatus: newStatus } : a));
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => 
      apt.expertName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [appointments, searchQuery]);

  const columns: { id: TriageStatus; label: string; icon: any; color: string }[] = [
    { id: 'scheduled', label: 'Scheduled', icon: Calendar, color: 'text-blue-500' },
    { id: 'checked_in', label: 'Checked-In', icon: MapPin, color: 'text-amber-500' },
    { id: 'in_consultation', label: 'In Consultation', icon: Activity, color: 'text-indigo-500' },
    { id: 'pharmacy', label: 'Pharmacy', icon: Pill, color: 'text-rose-500' },
    { id: 'discharged', label: 'Discharged', icon: CheckCircle, color: 'text-emerald-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-[1600px] mx-auto px-4 relative z-10">
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/hospital/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft size={12} /> Institutional Console
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <ClipboardList size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Institutional <span className="text-emerald-600">Registry.</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              A real-time command board for patient triage and clinical flow across the facility.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-64 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search Patient Node..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all shadow-sm"
              />
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-100 dark:border-white/5 flex gap-1 shadow-sm">
              <button 
                onClick={() => setViewMode('kanban')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'kanban' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {viewMode === 'kanban' ? (
            <RegistryKanbanView 
              filteredAppointments={filteredAppointments}
              columns={columns}
              handleTriageUpdate={handleTriageUpdate}
            />
          ) : (
            <RegistryListView 
              filteredAppointments={filteredAppointments}
              columns={columns}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
