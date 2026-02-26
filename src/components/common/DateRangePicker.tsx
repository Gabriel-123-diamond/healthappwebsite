'use client';

import React, { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X, Check } from 'lucide-react';
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
  parseISO
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  useClickOutside(containerRef, () => setIsOpen(false));

  const start = useMemo(() => startDate ? parseISO(startDate) : null, [startDate]);
  const end = useMemo(() => endDate ? parseISO(endDate) : null, [endDate]);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  }, [currentMonth]);

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

  const getDayClass = (day: Date) => {
    const base = "flex items-center justify-center rounded-lg sm:rounded-xl text-[10px] sm:text-xs transition-all relative";
    if (start && isSameDay(day, start)) return `${base} bg-blue-600 text-white font-black z-10 shadow-lg shadow-blue-200`;
    if (end && isSameDay(day, end)) return `${base} bg-blue-600 text-white font-black z-10 shadow-lg shadow-blue-200`;
    if (start && end && isWithinInterval(day, { start, end })) return `${base} bg-blue-50 text-blue-600 font-bold rounded-none first:rounded-l-xl last:rounded-r-xl`;
    if (isToday(day)) return `${base} text-blue-600 font-black ring-1 ring-inset ring-blue-200`;
    return `${base} text-slate-600 hover:bg-slate-50 hover:text-blue-600`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-4 bg-white border-2 rounded-[20px] cursor-pointer transition-all ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-inner' : 'border-slate-100 hover:border-blue-200'
        }`}
      >
        <div className={`p-2 rounded-lg transition-colors ${startDate ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
          <CalendarIcon size={16} />
        </div>
        <span className={`text-sm font-black flex-1 ${startDate ? 'text-slate-900' : 'text-slate-400 font-medium uppercase tracking-widest text-[10px]'}`}>
          {startDate ? (endDate ? `${format(start!, 'MMM d')} - ${format(end!, 'MMM d, yyyy')}` : `From ${format(start!, 'MMM d, yyyy')}...`) : placeholder}
        </span>
        {startDate && (
          <button 
            onClick={(e) => { e.stopPropagation(); onRangeChange('', ''); }} 
            className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-slate-300"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full mt-3 right-0 lg:left-0 z-50 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 sm:p-6 min-w-[300px] sm:min-w-[320px] origin-top"
                      >
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 sm:p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                            <ChevronLeft size={16} className="sm:w-4 sm:h-4 text-slate-400" />
                          </button>
                          <h4 className="font-black text-slate-900 uppercase tracking-[0.2em] text-[9px] sm:text-[10px]">
                            {format(currentMonth, 'MMMM yyyy')}
                          </h4>
                          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 sm:p-2.5 hover:bg-slate-50 rounded-xl transition-colors">
                            <ChevronRight size={16} className="sm:w-4 sm:h-4 text-slate-400" />
                          </button>
                        </div>
          
                        <div className="grid grid-cols-7 gap-1 mb-2">
                          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                            <div key={d} className="h-8 w-8 sm:h-10 sm:w-10 flex items-center justify-center text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-widest">
                              {d}
                            </div>
                          ))}
                        </div>
          
                        <div className="grid grid-cols-7 gap-1">
                          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-8 w-8 sm:h-10 sm:w-10" />
                          ))}
                          
                          {days.map(day => (
                            <button
                              key={day.toISOString()}
                              onClick={() => handleDayClick(day)}
                              className={`${getDayClass(day)} h-8 w-8 sm:h-10 sm:w-10`}
                            >
                              {format(day, 'd')}
                            </button>
                          ))}
                        </div>
          
                        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {start && !end ? "Select End Date" : "Pick a Range"}
                          </span>
                          <button 
                            onClick={() => setIsOpen(false)} 
                            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white text-[10px] sm:text-xs font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                          >
                            Apply
                          </button>
                        </div>
                      </motion.div>        )}
      </AnimatePresence>
    </div>
  );
}