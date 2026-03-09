'use client';

import React, { useRef } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { isSameDay, isToday, format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useDatePicker } from '@/hooks/useDatePicker';
import { CalendarView } from './date-picker/CalendarView';
import { MonthView } from './date-picker/MonthView';
import { YearView } from './date-picker/YearView';

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
  const containerRef = useRef<HTMLDivElement>(null);
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
  
  useClickOutside(containerRef, () => {
    setIsOpen(false);
    setView('calendar');
  });

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

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
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 left-0 z-50 bg-white/95 dark:bg-[#0B1221]/95 backdrop-blur-xl rounded-[40px] shadow-3xl border border-slate-100 dark:border-white/5 p-6 sm:p-8 min-w-[340px] origin-top overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

            {view === 'calendar' && (
              <CalendarView 
                currentMonth={currentMonth}
                setCurrentMonth={setCurrentMonth}
                setView={setView}
                days={days}
                handleDayClick={handleDayClick}
                getDayClass={getDayClass}
              />
            )}

            {view === 'month' && (
              <MonthView 
                currentMonth={currentMonth}
                months={months}
                handleMonthSelect={handleMonthSelect}
              />
            )}

            {view === 'year' && (
              <YearView 
                currentMonth={currentMonth}
                years={years}
                handleYearSelect={handleYearSelect}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
