'use client';

import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, ChevronDown } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval, 
  isToday,
  isAfter,
  parseISO,
  setYear,
  setMonth,
  getYear,
  getMonth
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onRangeChange: (start: string, end: string) => void;
  placeholder?: string;
}

export default function DateRangePicker({ startDate, endDate, onRangeChange, placeholder = "Select Date Range" }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState<'calendar' | 'month' | 'year'>('calendar');
  const containerRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setView('calendar');
  });

  const start = useMemo(() => startDate ? parseISO(startDate) : null, [startDate]);
  const end = useMemo(() => endDate ? parseISO(endDate) : null, [endDate]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentMonth]);

  const years = useMemo(() => {
    const currentYear = getYear(new Date());
    const startYear = currentYear - 10; // Range pickers usually don't need 100 years
    return Array.from({ length: 21 }, (_, i) => startYear + i).reverse();
  }, []);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleDayClick = (day: Date) => {
    const dayStr = day.toISOString().split('T')[0];
    
    if (!start || (start && end)) {
      onRangeChange(dayStr, '');
    } else {
      if (isAfter(day, start)) {
        onRangeChange(startDate, dayStr);
        setIsOpen(false);
      } else {
        onRangeChange(dayStr, '');
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
    if (start && isSameDay(day, start)) return `${base} bg-blue-600 text-white font-black z-10 shadow-lg shadow-blue-200 dark:shadow-none`;
    if (end && isSameDay(day, end)) return `${base} bg-blue-600 text-white font-black z-10 shadow-lg shadow-blue-200 dark:shadow-none`;
    if (start && end && isWithinInterval(day, { start, end })) return `${base} bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-none first:rounded-l-xl last:rounded-r-xl`;
    if (isToday(day)) return `${base} text-blue-600 dark:text-blue-400 font-black ring-1 ring-inset ring-blue-200 dark:ring-blue-800`;
    return `${base} text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-white/5 border-2 rounded-[20px] cursor-pointer transition-all ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/5 dark:ring-blue-500/10 bg-white dark:bg-slate-900' : 'border-transparent dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-700 shadow-sm'
        }`}
      >
        <div className={`p-2 rounded-lg transition-colors ${startDate ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm'}`}>
          <CalendarIcon size={16} />
        </div>
        <span className={`text-sm font-black flex-1 truncate whitespace-nowrap ${startDate ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest text-[10px]'}`}>
          {startDate ? (endDate ? `${format(start!, 'MMM d')} - ${format(end!, 'MMM d, yyyy')}` : `From ${format(start!, 'MMM d, yyyy')}...`) : placeholder}
        </span>
        {startDate && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRangeChange('', ''); }} 
            className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg transition-colors text-slate-300 dark:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
        <ChevronDown size={16} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 right-0 lg:left-0 z-50 bg-white dark:bg-[#0B1221] rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 p-4 sm:p-6 min-w-[280px] sm:min-w-[320px] origin-top transition-colors"
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

                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    {start && !end ? "Select End Date" : "Pick a Range"}
                  </span>
                  <button 
                    onClick={() => setIsOpen(false)} 
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-[10px] sm:text-xs font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
                  >
                    Apply
                  </button>
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
