'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, Clock, Save, ArrowLeft, 
  Loader2, CheckCircle2, Plus, Trash2, 
  ShieldCheck, Activity, Globe
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { appointmentService } from '@/services/appointmentService';
import NiceModal from '@/components/common/NiceModal';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function ExpertCalendarPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [slots, setSlots] = useState<{ [key: string]: string[] }>({});
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const data = await appointmentService.getExpertAvailability(user.uid);
        if (data) {
          setActiveDays(data.activeDays || []);
          setSlots(data.slots || {});
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setSaving(true);
    try {
      await appointmentService.setExpertAvailability(user.uid, {
        expertId: user.uid,
        activeDays,
        slots,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
      setModalConfig({
        isOpen: true,
        title: "Node Updated",
        description: "Your clinical availability has been broadcasted to the network.",
        type: 'success'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (day: string) => {
    if (activeDays.includes(day)) {
      setActiveDays(activeDays.filter(d => d !== day));
    } else {
      setActiveDays([...activeDays, day]);
      if (!slots[day]) {
        setSlots({ ...slots, [day]: ['09:00', '10:00', '11:00'] });
      }
    }
  };

  const addSlot = (day: string) => {
    const currentSlots = slots[day] || [];
    setSlots({ ...slots, [day]: [...currentSlots, '12:00'] });
  };

  const updateSlot = (day: string, idx: number, val: string) => {
    const newSlots = [...slots[day]];
    newSlots[idx] = val;
    setSlots({ ...slots, [day]: newSlots });
  };

  const removeSlot = (day: string, idx: number) => {
    const newSlots = [...slots[day]];
    newSlots.splice(idx, 1);
    setSlots({ ...slots, [day]: newSlots });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link href="/expert/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft size={12} /> Expert Console
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Calendar size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Calendar <span className="text-blue-600">Node.</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Configure your clinical availability nodes. Users can book appointments only within these authorized time slots.
            </p>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Deploy Nodes
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Day Selection */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2 mb-6">Active Days</h3>
            {DAYS.map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-full p-6 rounded-3xl text-left transition-all border ${
                  activeDays.includes(day)
                    ? 'bg-white dark:bg-slate-900 border-blue-500/30 shadow-xl shadow-blue-500/5'
                    : 'bg-transparent border-transparent text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black uppercase tracking-tight">{day}</span>
                  {activeDays.includes(day) && <CheckCircle2 size={16} className="text-blue-600" />}
                </div>
              </button>
            ))}
          </div>

          {/* Slot Configuration */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Authorized Time Slots</h3>
            
            {activeDays.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-dashed border-slate-200 dark:border-white/10 p-20 text-center">
                <Activity size={32} className="mx-auto text-slate-200 mb-6" />
                <p className="text-slate-400 font-bold text-sm">Select active days to configure time nodes.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeDays.map(day => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={day} 
                    className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{day}</h4>
                      <button 
                        onClick={() => addSlot(day)}
                        className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-all"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {slots[day]?.map((slot, idx) => (
                        <div key={idx} className="relative group">
                          <input 
                            type="time"
                            value={slot}
                            onChange={(e) => updateSlot(day, idx, e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl text-xs font-black border border-transparent focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                          />
                          <button 
                            onClick={() => removeSlot(day, idx)}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg shadow-red-500/20"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Timezone Info */}
            <div className="p-6 rounded-[32px] bg-slate-900 text-white flex items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-2xl rounded-full" />
              <Globe size={20} className="text-blue-400" />
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Current Timezone Node</p>
                <p className="text-xs font-bold">{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </div>
  );
}
