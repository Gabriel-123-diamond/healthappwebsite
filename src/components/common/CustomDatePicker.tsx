'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Check, ChevronDown } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isToday,
  parseISO,
  setYear,
  setMonth,
  getYear,
  getMonth
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  error?: string;
  required?: boolean;
}

export default function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = "Select Date", 
  minDate, 
  maxDate,
  label,
  error,
  required
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value ? parseISO(value) : new Date());
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setView('calendar');
  });

  const selectedDate = useMemo(() => value ? parseISO(value) : null, [value]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentMonth]);

  const years = useMemo(() => {
    const currentYear = getYear(new Date());
    const startYear = minDate ? getYear(minDate) : currentYear - 100;
    const endYear = maxDate ? getYear(maxDate) : currentYear + 10;
    const length = Math.max(0, endYear - startYear + 1);
    return Array.from({ length }, (_, i) => startYear + i).reverse();
  }, [minDate, maxDate]);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const isDateDisabled = (day: Date) => {
    if (minDate && day < startOfMonth(minDate)) return true;
    if (maxDate && day > maxDate) return true;
    return false;
  };

  const handleDayClick = (day: Date) => {
    if (isDateDisabled(day)) return;
    onChange(day.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(setYear(currentMonth, year));
    setView('calendar');
  };

  const handleMonthSelect = (monthIdx: number) => {
    setCurrentMonth(setMonth(currentMonth, monthIdx));
    setView('calendar');
  };

  const getDayClass = (day: Date) => {
    const base = "h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl text-[10px] sm:text-xs transition-all relative";
    
    if (isDateDisabled(day)) {
      return `${base} opacity-20 cursor-not-allowed pointer-events-none`;
    }

    if (selectedDate && isSameDay(day, selectedDate)) {
      return `${base} bg-blue-600 text-white font-black z-10 shadow-lg shadow-blue-200 dark:shadow-none`;
    }
    if (isToday(day)) {
      return `${base} text-blue-600 dark:text-blue-400 font-black ring-1 ring-inset ring-blue-200 dark:ring-blue-800`;
    }
    return `${base} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-white/5 border-2 rounded-2xl cursor-pointer transition-all ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/5 dark:ring-blue-500/10 bg-white dark:bg-slate-900' : 
          error ? 'border-red-500' : 'border-transparent hover:border-blue-200 dark:hover:border-blue-800 shadow-sm'
        }`}
      >
        <div className={`p-2 rounded-lg transition-colors ${value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm'}`}>
          <CalendarIcon size={16} />
        </div>
        <span className={`text-sm font-bold flex-1 truncate whitespace-nowrap ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
          {value ? format(selectedDate!, 'MMM d, yyyy') : placeholder}
        </span>
        <ChevronDown size={16} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {error && (
        <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider flex items-center gap-1 animate-pulse">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {error}
        </p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 left-0 z-50 bg-white dark:bg-[#0B1221] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 p-4 sm:p-6 min-w-[280px] sm:min-w-[320px] origin-top transition-colors"
          >
            {view === 'calendar' && (
              <>
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                    <ChevronLeft size={16} />
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => setView('month')}
                      className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {format(currentMonth, 'MMMM')}
                    </button>
                    <button 
                      onClick={() => setView('year')}
                      className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px] hover:text-blue-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {format(currentMonth, 'yyyy')}
                    </button>
                  </div>

                  <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="h-10 w-10 flex items-center justify-center text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-10 w-10" />
                  ))}
                  
                  {days.map(day => (
                    <button
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day)}
                      className={getDayClass(day)}
                    >
                      {format(day, 'd')}
                    </button>
                  ))}
                </div>
              </>
            )}

            {view === 'month' && (
              <div className="grid grid-cols-3 gap-2">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => handleMonthSelect(i)}
                    className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      getMonth(currentMonth) === i 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {view === 'year' && (
              <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => handleYearSelect(y)}
                    className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      getYear(currentMonth) === y 
                        ? 'bg-blue-600 text-white shadow-lg' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
