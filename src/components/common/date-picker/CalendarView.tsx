import React from 'react';
import { ChevronLeft, ChevronRight, Edit3, Calendar } from 'lucide-react';
import { 
  format, 
  subMonths, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth,
  isSameDay
} from 'date-fns';

interface CalendarViewProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  setView: (view: 'calendar' | 'month' | 'year') => void;
  days: Date[];
  handleDayClick: (day: Date) => void;
  getDayClass: (day: Date) => string;
  showMonthPicker?: boolean;
  showYearPicker?: boolean;
}

export function CalendarView({
  currentMonth,
  setCurrentMonth,
  setView,
  days,
  handleDayClick,
  getDayClass,
  showMonthPicker = true,
  showYearPicker = true,
}: CalendarViewProps) {
  // Generate a full grid (always 6 weeks) for visual consistency
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  // Ensure 42 days (6 weeks)
  while (calendarDays.length < 42) {
    const lastDay = calendarDays[calendarDays.length - 1];
    const nextDay = new Date(lastDay);
    nextDay.setDate(lastDay.getDate() + 1);
    calendarDays.push(nextDay);
  }

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-2">
          {showMonthPicker && (
            <button 
              type="button"
              onClick={() => setView('month')}
              className="font-bold text-slate-900 dark:text-white text-base hover:bg-slate-100 dark:hover:bg-white/5 transition-all px-2 py-1 rounded-lg"
            >
              {format(currentMonth, 'MMMM')}
            </button>
          )}
          {!showMonthPicker && (
            <span className="font-bold text-slate-900 dark:text-white text-base px-2 py-1">
              {format(currentMonth, 'MMMM')}
            </span>
          )}
          
          {showYearPicker && (
            <button 
              type="button"
              onClick={() => setView('year')}
              className="font-bold text-slate-500 dark:text-slate-400 text-base hover:bg-slate-100 dark:hover:bg-white/5 transition-all px-2 py-1 rounded-lg"
            >
              {format(currentMonth, 'yyyy')}
            </button>
          )}
          {!showYearPicker && (
            <span className="font-bold text-slate-500 dark:text-slate-400 text-base px-2 py-1">
              {format(currentMonth, 'yyyy')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button 
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
            className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-all text-slate-600 dark:text-slate-400 hover:text-blue-600"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid gap-1 mb-2" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {weekDays.map((d, i) => (
          <div key={`${d}-${i}`} className="aspect-square flex items-center justify-center text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const baseClass = getDayClass(day);
          
          return (
            <button
              type="button"
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`${baseClass} w-full ${!isCurrentMonth ? 'text-slate-300 dark:text-slate-700' : ''}`}
            >
              <span className="relative z-10">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
        <button 
          type="button"
          onClick={() => handleDayClick(new Date())}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all duration-300"
        >
          <Calendar size={12} className="group-hover:scale-110 transition-transform" />
          Today
        </button>
        
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Digital Input Enabled
        </div>
      </div>
    </div>
  );
}
