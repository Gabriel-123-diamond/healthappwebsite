'use client';

import React, { useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { isSameDay, isToday } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDatePicker } from '@/hooks/useDatePicker';
import { CalendarView } from './date-picker/CalendarView';
import { MonthView } from './date-picker/MonthView';
import { YearView } from './date-picker/YearView';

type ViewType = 'year' | 'month' | 'day';

const DEFAULT_VIEWS: ViewType[] = ['year', 'month', 'day'];

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  label?: string;
  error?: string;
  required?: boolean;
  views?: ViewType[];
  openTo?: ViewType;
}

export default function CustomDatePicker({ 
  value, 
  onChange, 
  placeholder = "Select Date", 
  minDate, 
  maxDate,
  label,
  error,
  required,
  views = DEFAULT_VIEWS,
  openTo
}: CustomDatePickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const {
    isOpen,
    setIsOpen,
    inputValue,
    currentMonth,
    setCurrentMonth,
    view,
    setView,
    selectedDate,
    days,
    years,
    handleDayClick,
    handleInputChange,
    handleYearSelect,
    handleMonthSelect,
    isDateDisabled,
  } = useDatePicker(value, onChange, minDate, maxDate);

  // Sync internal view only when opening
  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      const initialView = openTo || (views.includes('year') ? 'year' : views[0]);
      setView(initialView === 'day' ? 'calendar' : initialView as any);
    }
    wasOpen.current = isOpen;
  }, [isOpen, openTo, views, setView]);
  
  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getDayClass = (day: Date) => {
    const base = "flex items-center justify-center rounded-full text-[12px] sm:text-sm transition-all relative font-bold duration-200 aspect-square";
    
    if (isDateDisabled(day)) {
      return `${base} opacity-10 cursor-not-allowed grayscale pointer-events-none`;
    }

    if (selectedDate && isSameDay(day, selectedDate)) {
      return `${base} bg-blue-600 text-white font-black z-10 shadow-md`;
    }
    if (isToday(day)) {
      return `${base} text-blue-600 dark:text-blue-400 font-black ring-1 ring-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10`;
    }
    return `${base} text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white`;
  };

  const handleCustomYearSelect = (year: number) => {
    if (views.includes('month')) {
      handleYearSelect(year); // This calls hook's handleYearSelect which sets view to 'month'
    } else if (views.includes('day')) {
      handleYearSelect(year);
      setView('calendar');
    } else {
      onChange(year.toString());
      setIsOpen(false);
    }
  };

  const handleCustomMonthSelect = (monthIdx: number) => {
    if (views.includes('day')) {
      handleMonthSelect(monthIdx); // This calls hook's handleMonthSelect which sets view to 'calendar'
    } else {
      // If only year/month, we might need a specific format or just close
      handleMonthSelect(monthIdx);
      if (!views.includes('day')) setIsOpen(false);
    }
  };

  const displayValue = !views.includes('day') && value ? value : inputValue;

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
            value={displayValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            readOnly={!views.includes('day')}
            className="w-full bg-transparent border-none outline-none text-sm font-black text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 tracking-tight"
          />
        </div>

        <button 
          type="button"
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
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 z-[100] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 w-[280px] sm:w-[320px] origin-top overflow-hidden"
          >
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {view === 'calendar' && (
                  <motion.div
                    key="calendar"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                  >
                    <CalendarView 
                      currentMonth={currentMonth}
                      setCurrentMonth={setCurrentMonth}
                      setView={(v) => views.includes(v as any) && setView(v)}
                      days={days}
                      handleDayClick={handleDayClick}
                      getDayClass={getDayClass}
                      showMonthPicker={views.includes('month')}
                      showYearPicker={views.includes('year')}
                    />
                  </motion.div>
                )}

                {view === 'month' && (
                  <motion.div
                    key="month"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="mb-4 flex items-center justify-between px-1">
                       <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Month</h3>
                       <button onClick={() => setView('calendar')} className="text-[10px] font-bold text-blue-600 uppercase">Back</button>
                    </div>
                    <MonthView 
                      currentMonth={currentMonth}
                      months={months}
                      handleMonthSelect={handleCustomMonthSelect}
                    />
                  </motion.div>
                )}

                {view === 'year' && (
                  <motion.div
                    key="year"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="mb-4 flex items-center justify-between px-1">
                       <h3 className="text-sm font-bold text-slate-900 dark:text-white">Select Year</h3>
                       <button onClick={() => setView('calendar')} className="text-[10px] font-bold text-blue-600 uppercase">Back</button>
                    </div>
                    <YearView 
                      currentMonth={currentMonth}
                      years={years}
                      handleYearSelect={handleCustomYearSelect}
                      minDate={minDate}
                      maxDate={maxDate}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
