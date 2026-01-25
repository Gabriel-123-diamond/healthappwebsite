'use client';

import React from 'react';
import { JournalEntry } from '@/services/journalService';
import { Thermometer, Smile, MessageSquare, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface JournalHistoryListProps {
  entries: JournalEntry[];
}

export default function JournalHistoryList({ entries }: JournalHistoryListProps) {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      alert('Entry deleted (Mock)');
    }
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl text-center border border-dashed border-slate-300">
        <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-slate-900">No entries yet</h3>
        <p className="text-slate-500">Start tracking your health journey today.</p>
      </div>
    );
  }

  // Display most recent first
  const sortedEntries = [...entries].reverse();

  return (
    <div className="space-y-4">
      {sortedEntries.map((entry) => (
        <div key={entry.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group relative">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-sm font-medium text-slate-500">
                {format(entry.timestamp, 'PPP p')}
              </span>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1 text-red-600">
                  <Thermometer className="w-4 h-4" />
                  <span className="font-bold">Level {entry.severity}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Smile className="w-4 h-4" />
                  <span>{entry.mood}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => entry.id && handleDelete(entry.id)}
              className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
              title="Delete entry"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {entry.symptoms.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                {s}
              </span>
            ))}
          </div>

          {entry.notes && (
            <div className="bg-slate-50 p-3 rounded-xl text-slate-600 text-sm flex gap-2">
              <MessageSquare className="w-4 h-4 flex-shrink-0 mt-1" />
              <p>{entry.notes}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
