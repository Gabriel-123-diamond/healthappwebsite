'use client';

import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { addJournalEntry } from '@/services/journalService';
import { auth } from '@/lib/firebase';
import { Dropdown } from '@/components/ui/Dropdown';

interface JournalEntryFormProps {
  onEntryAdded: () => void;
}

export default function JournalEntryForm({ onEntryAdded }: JournalEntryFormProps) {
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-8">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-blue-600" />
        New Entry
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
            Severity: {severity}/10 <span className="text-red-500">*</span>
          </label>
          <input 
            type="range" min="1" max="10" 
            value={severity} 
            onChange={(e) => setSeverity(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Symptoms (comma separated)
          </label>
          <input 
            type="text" 
            placeholder="Headache, Fatigue..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-1">
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
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Notes
          </label>
          <textarea 
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
            placeholder="How are you feeling today?"
          />
        </div>

        <button
          type="submit"
          disabled={adding}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {adding ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}
