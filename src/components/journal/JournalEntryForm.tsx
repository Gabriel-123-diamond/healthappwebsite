'use client';

import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { addJournalEntry } from '@/services/journalService';
import { auth } from '@/lib/firebase';
import { Dropdown } from '@/components/ui/Dropdown';
import { useTranslations } from 'next-intl';

interface JournalEntryFormProps {
  onEntryAdded: () => void;
}

export default function JournalEntryForm({ onEntryAdded }: JournalEntryFormProps) {
  const t = useTranslations('journalPage.form');
  const [severity, setSeverity] = useState(5);
  const [symptoms, setSymptoms] = useState('');
  const [mood, setMood] = useState('Neutral');
  const [notes, setNotes] = useState('');
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    
    setAdding(true);
    try {
      await addJournalEntry({
        userId: auth.currentUser.uid,
        severity,
        symptoms: symptoms.split(',').map(s => s.trim()).filter(s => s),
        mood,
        notes
      });
      // Reset form
      setSeverity(5);
      setSymptoms('');
      setMood('Neutral');
      setNotes('');
      onEntryAdded();
    } catch (error) {
      console.error("Error adding journal:", error);
    } finally {
      setAdding(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0B1221] p-6 sm:p-8 rounded-[32px] shadow-xl border border-slate-100 dark:border-white/5 transition-colors">
      <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white uppercase tracking-tight">
        <div className="p-2 bg-blue-600 rounded-xl text-white">
          <Plus className="w-5 h-5" />
        </div>
        {t('submit')}
      </h2>
      
      <div className="space-y-8">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 flex items-center justify-between">
            <span>{t('severity')}: {severity}/10</span>
            <span className="text-red-500">*</span>
          </label>
          <input 
            type="range" min="1" max="10" 
            value={severity} 
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
            {t('symptoms')}
          </label>
          <input 
            type="text" 
            placeholder={t('placeholderSymptoms')}
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-1">
            Mood <span className="text-red-500">*</span>
          </label>
          <Dropdown
            value={mood}
            onChange={setMood}
            options={[
              { value: 'Great', label: 'Great' },
              { value: 'Good', label: 'Good' },
              { value: 'Neutral', label: 'Neutral' },
              { value: 'Poor', label: 'Poor' },
              { value: 'Awful', label: 'Awful' },
            ]}
            placeholder="Select Mood"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
            {t('notes')}
          </label>
          <textarea 
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-2 border-transparent outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white text-sm resize-none"
            placeholder={t('placeholderNotes')}
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-blue-600 dark:hover:bg-blue-500 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : <>{t('submit')} <Plus className="w-4 h-4" /></>}
        </button>
      </div>
    </form>
  );
}
