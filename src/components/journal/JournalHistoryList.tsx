'use client';

import React, { useState } from 'react';
import { JournalEntry, deleteJournalEntry } from '@/services/journalService';
import { Thermometer, Smile, MessageSquare, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import NiceModal from '@/components/common/NiceModal';

interface JournalHistoryListProps {
  entries: JournalEntry[];
}

export default function JournalHistoryList({ entries }: JournalHistoryListProps) {
  const t = useTranslations('journalPage');
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm
    });
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "Delete Entry",
      "Are you sure you want to permanently delete this health journal entry? This action cannot be undone.",
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await deleteJournalEntry(id);
          window.location.reload(); // Simple refresh to update list
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 p-12 rounded-[48px] text-center border border-dashed border-slate-200 dark:border-slate-800">
        <Calendar className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('noEntries')}</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Start tracking your health journey today.</p>
      </div>
    );
  }

  // Display most recent first
  const sortedEntries = [...entries].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <div className="space-y-6">
      {sortedEntries.map((entry) => (
        <div key={entry.id} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[32px] shadow-sm border border-slate-100 dark:border-white/5 group relative transition-all hover:shadow-xl hover:border-blue-500/20">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {format(entry.timestamp, 'PPP p')}
              </span>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <div className="p-1.5 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-tight">Level {entry.severity}</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Smile className="w-4 h-4" />
                  </div>
                  <span className="font-black text-sm uppercase tracking-tight">{entry.mood}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => entry.id && handleDelete(entry.id)}
              className="p-3 text-slate-300 hover:text-red-500 transition-all rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 md:opacity-0 group-hover:opacity-100"
              title="Delete entry"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {entry.symptoms.map((s, i) => (
              <span key={i} className="px-4 py-1.5 bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100 dark:border-white/5">
                {s}
              </span>
            ))}
          </div>

          {entry.notes && (
            <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-2xl text-slate-600 dark:text-slate-400 text-sm flex gap-3 border border-slate-100 dark:border-white/5 leading-relaxed">
              <MessageSquare className="w-4 h-4 flex-shrink-0 mt-1 text-blue-500" />
              <p className="font-medium">{entry.notes}</p>
            </div>
          )}
        </div>
      ))}

      <NiceModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Delete Entry"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
