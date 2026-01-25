'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getUserJournals, JournalEntry } from '@/services/journalService';
import { Loader2, BarChart2, List } from 'lucide-react';
import JournalEntryForm from '@/components/journal/JournalEntryForm';
import JournalHistoryList from '@/components/journal/JournalHistoryList';
import JournalTrendsChart from '@/components/journal/JournalTrendsChart';

export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'trends'>('list');

  const fetchEntries = async () => {
    if (!auth.currentUser) return;
    try {
      const data = await getUserJournals(auth.currentUser.uid);
      setEntries(data);
    } catch (error) {
      console.error("Error fetching journals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchEntries();
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Health Journal</h1>
            <p className="text-slate-600">Track your symptoms and well-being over time.</p>
          </div>
          <div className="flex bg-white rounded-lg p-1 border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('trends')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'trends' ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <BarChart2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Entry Form */}
          <div className="lg:col-span-1">
            <JournalEntryForm onEntryAdded={fetchEntries} />
          </div>

          {/* History List or Trends Chart */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : viewMode === 'list' ? (
              <JournalHistoryList entries={entries} />
            ) : (
              <JournalTrendsChart entries={entries} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
