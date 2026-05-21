'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  Bell, Plus, ArrowLeft, Loader2
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { reminderService, MedicationReminder } from '@/services/reminderService';
import { UserProfile } from '@/types/user';
import { 
  RemindersLockedState, EmptyRemindersState, AddReminderForm, ReminderCard 
} from '@/components/reminders/ReminderComponents';

export default function MedicationRemindersPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  // Form State
  const [medName, setMedName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [time, setTime] = useState('08:00');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const userProfile = await userService.getUserProfile(user.uid);
        setProfile(userProfile);

        if (userProfile?.tier === 'vip2' || userProfile?.tier === 'premium') {
          const data = await reminderService.getReminders();
          setReminders(data);
        }
      } catch (error) {
        console.error("Failed to fetch reminders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newReminder = await reminderService.addReminder({
        medicationName: medName,
        dosage,
        frequency,
        times: [time],
        startDate: new Date().toISOString().split('T')[0]
      });
      setReminders([newReminder as MedicationReminder, ...reminders]);
      setShowAddForm(false);
      setMedName('');
      setDosage('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      await reminderService.toggleReminder(id, !currentStatus);
      setReminders(reminders.map(r => r.id === id ? { ...r, isActive: !currentStatus } : r));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await reminderService.deleteReminder(id);
      setReminders(reminders.filter(r => r.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const isElite = profile?.tier === 'vip2' || profile?.tier === 'premium';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isElite) {
    return <RemindersLockedState />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Bell size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Medication <span className="text-indigo-600">Nodes.</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Configure automated reminders for your clinical prescriptions. Adherence data is stored locally within your intelligence node.
            </p>
          </div>

          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
          >
            <Plus size={14} /> Schedule Node
          </button>
        </header>

        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {showAddForm && (
              <AddReminderForm
                medName={medName}
                setMedName={setMedName}
                dosage={dosage}
                setDosage={setDosage}
                time={time}
                setTime={setTime}
                onSubmit={handleAddReminder}
                onCancel={() => setShowAddForm(false)}
                submitting={submitting}
              />
            )}
          </AnimatePresence>

          {reminders.length === 0 ? (
            <EmptyRemindersState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reminders.map((reminder) => (
                <ReminderCard 
                  key={reminder.id} 
                  reminder={reminder} 
                  onToggle={handleToggle} 
                  onDelete={handleDelete} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
