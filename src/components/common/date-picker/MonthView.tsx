import React from 'react';
import { getMonth } from 'date-fns';

interface MonthViewProps {
  currentMonth: Date;
  months: string[];
  handleMonthSelect: (monthIdx: number) => void;
}

export function MonthView({ currentMonth, months, handleMonthSelect }: MonthViewProps) {
  return (
    <div className="grid grid-cols-3 gap-3 relative z-10">
      {months.map((m, i) => (
        <button
          type="button"
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
  );
}
