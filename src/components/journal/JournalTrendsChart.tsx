'use client';

import React, { useState, useEffect } from 'react';
import { SymptomLog } from '@/services/journalService';
import { format } from 'date-fns';
import { Brain, Sparkles, Loader2 } from 'lucide-react';
import { auth } from '@/lib/firebase';

interface JournalTrendsChartProps {
  entries: SymptomLog[];
}

export default function JournalTrendsChart({ entries }: JournalTrendsChartProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl text-center border border-dashed border-slate-300 dark:border-slate-700">
        <p className="text-slate-500">Not enough data to show trends. Add more entries!</p>
      </div>
    );
  }

  // Helper to get time
  const getTime = (entry: SymptomLog) => {
    return entry.loggedAt?.seconds ? entry.loggedAt.seconds * 1000 : new Date(entry.loggedAt).getTime();
  };

  // Sort by date (oldest to newest for the chart) and take last 7
  const recentEntries = [...entries]
    .sort((a, b) => getTime(a) - getTime(b))
    .slice(-7);

  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    async function fetchInsights() {
      if (entries.length < 3) return; // Wait to have enough data points
      const user = auth.currentUser;
      if (!user) return;

      setLoadingInsight(true);
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/journal/insights', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          // Send only the last 10 entries for context limits
          body: JSON.stringify({ entries: entries.slice(-10) })
        });
        
        if (response.ok) {
          const data = await response.json();
          setInsight(data.insight);
        }
      } catch (e) {
        console.error("Failed to load insights:", e);
      } finally {
        setLoadingInsight(false);
      }
    }
    
    fetchInsights();
  }, [entries]);

  const averageSeverity = (entries.reduce((acc, curr) => acc + curr.severity, 0) / entries.length).toFixed(1);

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
                 <div className="absolute -top-10 left-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                    Level {entry.severity}
                 </div>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                {format(new Date(getTime(entry)), 'MMM d')}
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

      {entries.length >= 3 ? (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-lg text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-200" />
              AI Health Intelligence
            </h3>
          </div>
          {loadingInsight ? (
            <div className="flex items-center gap-3 text-blue-100 italic text-sm py-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Synthesizing longitudinal journal correlations...
            </div>
          ) : insight ? (
            <p className="text-blue-50 leading-relaxed text-sm font-medium">
              {insight}
            </p>
          ) : (
            <p className="text-blue-100 leading-relaxed text-sm">
              Keep logging daily. The AI intelligence engine analyzes subtle correlations across at least 3 entries to produce meaningful clinical observations.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-center">
          <Brain className="w-6 h-6 text-slate-400 mx-auto mb-2 opacity-50" />
          <p className="text-slate-500 text-xs uppercase tracking-widest font-black">AI Insights Unlocked At 3 Logs</p>
        </div>
      )}
    </div>
  );
}
