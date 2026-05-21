'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Plus, ArrowLeft, Loader2
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { journalService, SymptomLog } from '@/services/journalService';
import { UserProfile } from '@/types/user';
import { 
  JournalLockedState, EmptyJournalState, AddJournalEntryForm, JournalEntryCard 
} from '@/components/journal/JournalComponents';
import { useTranslations } from 'next-intl';

export default function SymptomJournalPage() {
  const t = useTranslations('journal');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [logs, setLogs] = useState<SymptomLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const router = useRouter();

  // Form State
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState<number>(1);
  const [notes, setNotes] = useState('');

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

        if (userProfile?.tier === 'vip1' || userProfile?.tier === 'vip2' || userProfile?.tier === 'premium') {
          const data = await journalService.getLogs();
          setLogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch journal logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setSubmitting(true);
    try {
      const symptomList = symptoms.split(',').map(s => s.trim()).filter(s => s);
      const newLog = await journalService.addLog(symptomList, severity, notes);
      setLogs([newLog as SymptomLog, ...logs]);
      setShowAddForm(false);
      setSymptoms('');
      setSeverity(1);
      setNotes('');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await journalService.deleteLog(id);
      setLogs(logs.filter(l => l.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const isPremium = profile?.tier === 'vip1' || profile?.tier === 'vip2' || profile?.tier === 'premium';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isPremium) {
    return <JournalLockedState />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
                <BookOpen size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                {t('title').split(' ')[0]} <span className="text-rose-600">{t('title').split(' ')[1]}</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              {t('subtitle')}
            </p>
          </div>

          <button 
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-rose-600/20 hover:bg-rose-700 transition-all"
          >
            <Plus size={14} /> {t('newEntry')}
          </button>
        </header>

        <AnimatePresence>
          {showAddForm && (
            <AddJournalEntryForm
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              severity={severity}
              setSeverity={setSeverity}
              notes={notes}
              setNotes={setNotes}
              onSubmit={handleAddLog}
              onCancel={() => setShowAddForm(false)}
              submitting={submitting}
            />
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {logs.length === 0 ? (
            <EmptyJournalState />
          ) : (
            <div className="relative border-l-2 border-slate-100 dark:border-white/5 ml-4 md:ml-8 space-y-12 pb-12">
              {logs.map((log) => (
                <JournalEntryCard key={log.id} log={log} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
