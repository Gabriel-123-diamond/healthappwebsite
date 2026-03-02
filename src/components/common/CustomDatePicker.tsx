'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Check, ChevronDown, Edit3 } from 'lucide-react';
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
  getMonth,
  isValid,
  parse
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
  const [inputValue, setInputValue] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setView('calendar');
  });

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const date = parseISO(value);
      if (isValid(date)) {
        setInputValue(format(date, 'MMM d, yyyy'));
        setCurrentMonth(date);
      }
    } else {
      setInputValue('');
    }
  }, [value]);

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
    if (minDate && day < minDate && !isSameDay(day, minDate)) return true;
    if (maxDate && day > maxDate) return true;
    return false;
  };

  const handleDayClick = (day: Date) => {
    if (isDateDisabled(day)) return;
    onChange(format(day, 'yyyy-MM-dd'));
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Try to parse various formats
    const formats = ['MMM d, yyyy', 'MM/dd/yyyy', 'yyyy-MM-dd', 'd MMM yyyy'];
    for (const f of formats) {
      const parsed = parse(val, f, new Date());
      if (isValid(parsed) && !isDateDisabled(parsed)) {
        onChange(format(parsed, 'yyyy-MM-dd'));
        setCurrentMonth(parsed);
        break;
      }
    }
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
      return `${base} opacity-10 cursor-not-allowed grayscale pointer-events-none`;
    }

    if (selectedDate && isSameDay(day, selectedDate)) {
      return `${base} bg-blue-600 text-white font-black z-10 shadow-lg shadow-blue-400/40 scale-110`;
    }
    if (isToday(day)) {
      return `${base} text-blue-600 dark:text-blue-400 font-black ring-2 ring-inset ring-blue-500/20 bg-blue-500/5`;
    }
    return `${base} text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div 
        className={`group flex items-center gap-3 px-5 py-4 bg-white dark:bg-slate-900 border-2 rounded-[24px] transition-all duration-300 ${
          isOpen ? 'border-blue-500 ring-8 ring-blue-500/5 shadow-xl' : 
          error ? 'border-red-500' : 'border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm'
        }`}
      >
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2.5 rounded-xl transition-all duration-500 cursor-pointer ${value ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 shadow-inner'}`}
        >
          <CalendarIcon size={18} strokeWidth={2.5} />
        </div>
        
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full bg-transparent border-none outline-none text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 tracking-tight"
          />
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <ChevronDown size={18} className={`text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </button>
      </div>

      {error && (
        <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider flex items-center gap-1 animate-pulse">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {error}
        </p>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 left-0 z-50 bg-white/95 dark:bg-[#0B1221]/95 backdrop-blur-xl rounded-[40px] shadow-3xl border border-slate-100 dark:border-white/5 p-6 sm:p-8 min-w-[340px] origin-top overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

            {view === 'calendar' && (
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-blue-600 active:scale-90"
                  >
                    <ChevronLeft size={20} strokeWidth={3} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setView('month')}
                      className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[11px] hover:text-blue-600 transition-all px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      {format(currentMonth, 'MMMM')}
                    </button>
                    <button 
                      onClick={() => setView('year')}
                      className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[11px] hover:text-blue-600 transition-all px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      {format(currentMonth, 'yyyy')}
                    </button>
                  </div>

                  <button 
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
                    className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-blue-600 active:scale-90"
                  >
                    <ChevronRight size={20} strokeWidth={3} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={`${d}-${i}`} className="h-10 w-10 flex items-center justify-center text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
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

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <button 
                    onClick={() => handleDayClick(new Date())}
                    className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:opacity-70 transition-opacity"
                  >
                    Go to Today
                  </button>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <Edit3 size={12} />
                    Digital Input Enabled
                  </div>
                </div>
              </div>
            )}

            {view === 'month' && (
              <div className="grid grid-cols-3 gap-3 relative z-10">
                {months.map((m, i) => (
                  <button
                    key={m}
                    onClick={() => handleMonthSelect(i)}
                    className={`py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      getMonth(currentMonth) === i 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}

            {view === 'year' && (
              <div className="grid grid-cols-3 gap-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
                {years.map((y) => (
                  <button
                    key={y}
                    onClick={() => handleYearSelect(y)}
                    className={`py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                      getYear(currentMonth) === y 
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
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
