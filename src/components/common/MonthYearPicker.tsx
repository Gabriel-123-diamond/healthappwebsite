'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

interface MonthYearPickerProps {
  label: string;
  value: string; // "MM/YYYY" or "YYYY"
  onChange: (val: string) => void;
  required?: boolean;
  error?: string;
  placeholder?: string;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  label,
  value,
  onChange,
  required,
  error,
  placeholder = "Select Date"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse value
  const { currentMonth, currentYear } = useMemo(() => {
    if (!value) return { currentMonth: null, currentYear: new Date().getFullYear() };
    const parts = value.split('/');
    if (parts.length === 2) {
      return { currentMonth: parseInt(parts[0]) - 1, currentYear: parseInt(parts[1]) };
    }
    return { currentMonth: null, currentYear: parseInt(parts[0]) };
  }, [value]);

  const [viewYear, setViewYear] = useState(currentYear);

  useClickOutside(containerRef, () => setIsOpen(false));

  const handleSelect = (month: number | null, year: number) => {
    const formattedMonth = month !== null ? (month + 1).toString().padStart(2, '0') : null;
    const newVal = formattedMonth ? `${formattedMonth}/${year}` : `${year}`;
    onChange(newVal);
    setIsOpen(false);
  };

  return (
    <div className="w-full space-y-2 group" ref={containerRef}>
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 transition-all flex items-center justify-between outline-none font-bold text-sm ${
            isOpen ? 'border-blue-500 bg-white dark:bg-slate-900 ring-4 ring-blue-500/10' : 
            error ? 'border-red-500' : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
          } ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}
        >
          <div className="flex items-center gap-3">
            <CalendarIcon className={`w-4 h-4 ${isOpen ? 'text-blue-500' : 'text-slate-400'}`} />
            <span>{value || placeholder}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 top-full mt-3 left-0 w-72 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 overflow-hidden"
            >
              {/* Year Selector */}
              <div className="flex items-center justify-between mb-6 px-2">
                <button 
                  type="button"
                  onClick={() => setViewYear(viewYear - 1)}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{viewYear}</span>
                <button 
                  type="button"
                  onClick={() => setViewYear(viewYear + 1)}
                  className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Month Grid */}
              <div className="grid grid-cols-3 gap-2">
                {MONTHS.map((month, idx) => {
                  const isSelected = currentMonth === idx && currentYear === viewYear;
                  return (
                    <button
                      key={month}
                      type="button"
                      onClick={() => handleSelect(idx, viewYear)}
                      className={`py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                        isSelected 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600'
                      }`}
                    >
                      {month}
                    </button>
                  );
                })}
              </div>

              {/* Year Only Selection Option */}
              <button
                type="button"
                onClick={() => handleSelect(null, viewYear)}
                className="w-full mt-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                Select Full Year {viewYear}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && (
        <p className="mt-1 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};
