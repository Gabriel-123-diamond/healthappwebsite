import React from 'react';
import { ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { format, subMonths, addMonths, startOfMonth } from 'date-fns';

interface CalendarViewProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  setView: (view: 'calendar' | 'month' | 'year') => void;
  days: Date[];
  handleDayClick: (day: Date) => void;
  getDayClass: (day: Date) => string;
}

export function CalendarView({
  currentMonth,
  setCurrentMonth,
  setView,
  days,
  handleDayClick,
  getDayClass,
}: CalendarViewProps) {
  return (
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-8">
        <button 
          type="button"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
          className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all text-slate-400 hover:text-blue-600 active:scale-90"
        >
          <ChevronLeft size={20} strokeWidth={3} />
        </button>
        
        <div className="flex items-center gap-2">
          <button 
            type="button"
            onClick={() => setView('month')}
            className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[11px] hover:text-blue-600 transition-all px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {format(currentMonth, 'MMMM')}
          </button>
          <button 
            type="button"
            onClick={() => setView('year')}
            className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[11px] hover:text-blue-600 transition-all px-4 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {format(currentMonth, 'yyyy')}
          </button>
        </div>

        <button 
          type="button"
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
            type="button"
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
          type="button"
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
  );
}
