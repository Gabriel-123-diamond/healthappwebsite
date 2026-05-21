import React from 'react';
import { getMonth } from 'date-fns';

interface MonthViewProps {
  currentMonth: Date;
  months: string[];
  handleMonthSelect: (monthIdx: number) => void;
}

export function MonthView({ currentMonth, months, handleMonthSelect }: MonthViewProps) {
  return (
    <div className="grid grid-cols-3 gap-2 relative z-10">
      {months.map((m, i) => (
        <button
          type="button"
          key={m}
          onClick={() => handleMonthSelect(i)}
          className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
            getMonth(currentMonth) === i 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
          }`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
