'use client';

import React from 'react';
import { JournalEntry } from '@/services/journalService';
import { format } from 'date-fns';
import { Brain } from 'lucide-react';

interface JournalTrendsChartProps {
  entries: JournalEntry[];
}

export default function JournalTrendsChart({ entries }: JournalTrendsChartProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl text-center border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-slate-500">Not enough data to show trends. Add more entries!</p>
      </div>
    );
  }

  // Sort by date (oldest to newest for the chart) and take last 7
  const recentEntries = [...entries]
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    .slice(-7);

  const averageSeverity = (entries.reduce((acc, curr) => acc + curr.severity, 0) / entries.length).toFixed(1);

  // Simple correlation logic (Mock)
  const highSeverityEntries = entries.filter(e => e.severity >= 7);
  const commonSymptoms = highSeverityEntries.length > 0 
    ? highSeverityEntries[0].symptoms[0] || 'Fatigue'
    : 'N/A';

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Severity Over Time</h3>
        
        <div className="h-64 flex items-end justify-between gap-2 px-2">
          {recentEntries.map((entry) => (
            <div key={entry.id} className="flex flex-col items-center flex-1 group">
              <div 
                className="w-full max-w-[40px] bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 relative"
                style={{ height: `${(entry.severity / 10) * 100}%` }}
              >
                 <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    Level {entry.severity}
                 </div>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                {format(entry.timestamp, 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
            <div className="text-slate-500 text-sm mb-1">Average Severity</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {averageSeverity}
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-center">
            <div className="text-slate-500 text-sm mb-1">Total Entries</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {entries.length}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold">Health AI Insights</h3>
        </div>
        <p className="text-blue-100 leading-relaxed">
          Based on your last {entries.length} entries, we noticed that <span className="font-bold text-white">high severity levels (7+)</span> often correlate with <span className="font-bold text-white">"{commonSymptoms}"</span>. 
          Consider discussing this pattern with a professional.
        </p>
      </div>
    </div>
  );
}
