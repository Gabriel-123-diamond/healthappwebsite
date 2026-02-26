'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface TimeRange {
  start: string;
  end: string;
}

interface DayAvailability {
  day: string;
  enabled: boolean;
  ranges: TimeRange[];
}

interface AvailabilitySchedulerProps {
  value: string; // Serialized string for compatibility or JSON
  onChange: (val: string) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const AvailabilityScheduler: React.FC<AvailabilitySchedulerProps> = ({ value, onChange }) => {
  const [availability, setAvailability] = useState<DayAvailability[]>(() => {
    // Attempt to parse or return default
    try {
      if (value && value.startsWith('[')) {
        return JSON.parse(value);
      }
    } catch (e) {}
    
    return DAYS.map(d => ({
      day: d,
      enabled: d !== "Saturday" && d !== "Sunday",
      ranges: [{ start: "09:00", end: "17:00" }]
    }));
  });

  useEffect(() => {
    const serialized = JSON.stringify(availability);
    // Also create a human-readable summary for the profile if needed
    const summary = availability
      .filter(d => d.enabled)
      .map(d => `${d.day.substring(0, 3)}: ${d.ranges.map(r => `${r.start}-${r.end}`).join(', ')}`)
      .join('; ');
    
    // For now, we'll store JSON but could store the summary
    onChange(serialized);
  }, [availability]);

  const toggleDay = (idx: number) => {
    const newAvail = [...availability];
    newAvail[idx].enabled = !newAvail[idx].enabled;
    setAvailability(newAvail);
  };

  const addRange = (dayIdx: number) => {
    const newAvail = [...availability];
    newAvail[dayIdx].ranges.push({ start: "09:00", end: "17:00" });
    setAvailability(newAvail);
  };

  const removeRange = (dayIdx: number, rangeIdx: number) => {
    const newAvail = [...availability];
    newAvail[dayIdx].ranges = newAvail[dayIdx].ranges.filter((_, i) => i !== rangeIdx);
    if (newAvail[dayIdx].ranges.length === 0) newAvail[dayIdx].enabled = false;
    setAvailability(newAvail);
  };

  const updateTime = (dayIdx: number, rangeIdx: number, field: 'start' | 'end', val: string) => {
    const newAvail = [...availability];
    newAvail[dayIdx].ranges[rangeIdx][field] = val;
    setAvailability(newAvail);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Clock size={14} /> Weekly Consultation Hours
        </label>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {availability.map((d, dIdx) => (
          <div 
            key={d.day}
            className={`p-4 rounded-3xl border-2 transition-all duration-300 ${
              d.enabled 
                ? 'border-blue-100 dark:border-blue-900/30 bg-white dark:bg-slate-900 shadow-sm' 
                : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => toggleDay(dIdx)}
                  className={`w-12 h-6 rounded-full relative transition-colors ${d.enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${d.enabled ? 'left-7' : 'left-1'}`} />
                </button>
                <span className={`font-black uppercase tracking-widest text-xs ${d.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {d.day}
                </span>
              </div>

              {d.enabled && (
                <div className="flex flex-col gap-3 flex-1 sm:max-w-md">
                  {d.ranges.map((range, rIdx) => (
                    <div key={rIdx} className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                      <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1 rounded-xl flex-1 border border-slate-100 dark:border-slate-700">
                        <input 
                          type="time" 
                          value={range.start} 
                          onChange={(e) => updateTime(dIdx, rIdx, 'start', e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 dark:text-slate-200 w-full"
                        />
                        <span className="text-[10px] font-black text-slate-300">TO</span>
                        <input 
                          type="time" 
                          value={range.end} 
                          onChange={(e) => updateTime(dIdx, rIdx, 'end', e.target.value)}
                          className="bg-transparent border-none focus:ring-0 text-xs font-bold text-slate-700 dark:text-slate-200 w-full"
                        />
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => removeRange(dIdx, rIdx)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => addRange(dIdx)}
                    className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 w-fit px-2"
                  >
                    <Plus size={12} /> Add Range
                  </button>
                </div>
              )}

              {!d.enabled && (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Unavailable</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 flex items-start gap-3">
        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5" />
        <p className="text-[10px] font-bold text-blue-800 dark:text-blue-300 leading-relaxed uppercase tracking-tight">
          Patients can only book consultations during these windows. Ensure your time zone matches your clinical location.
        </p>
      </div>
    </div>
  );
};
