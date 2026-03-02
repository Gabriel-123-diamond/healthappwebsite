'use client';

import React, { useState, useRef } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CustomTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CustomTimePicker({
  value,
  onChange,
  placeholder = "Select Time",
  label
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(containerRef, () => setIsOpen(false));

  const timeSlots = [
    { label: 'Morning', slots: ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'] },
    { label: 'Afternoon', slots: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'] },
    { label: 'Evening', slots: ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'] },
  ];

  const handleTimeSelect = (time: string) => {
    onChange(time);
    setIsOpen(false);
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return placeholder;
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-2">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-white/5 border-2 rounded-2xl cursor-pointer transition-all ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/5 dark:ring-blue-500/10 bg-white dark:bg-slate-900' : 
          'border-transparent hover:border-blue-200 dark:hover:border-blue-800 shadow-sm'
        }`}
      >
        <div className={`p-2 rounded-lg transition-colors ${value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm'}`}>
          <Clock size={16} />
        </div>
        <span className={`text-sm font-bold flex-1 truncate ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
          {formatDisplayTime(value)}
        </span>
        <ChevronDown size={16} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 left-0 z-50 bg-white dark:bg-[#0B1221] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 p-6 min-w-[320px] origin-top"
          >
            <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              {timeSlots.map((section) => (
                <div key={section.label} className="space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-blue-500" />
                    {section.label}
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {section.slots.map((time) => (
                      <button
                        key={time}
                        onClick={() => handleTimeSelect(time)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all ${
                          value === time 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none' 
                            : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600'
                        }`}
                      >
                        {formatDisplayTime(time).replace(' AM', '').replace(' PM', '')}
                        <span className="text-[8px] opacity-60 ml-1">
                          {parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
