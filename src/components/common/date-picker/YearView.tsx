import React from 'react';
import { getYear } from 'date-fns';

interface YearViewProps {
  currentMonth: Date;
  years: number[];
  handleYearSelect: (year: number) => void;
}

export function YearView({ currentMonth, years, handleYearSelect }: YearViewProps) {
  return (
    <div className="grid grid-cols-3 gap-3 max-h-[320px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
      {years.map((y) => (
        <button
          type="button"
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
  );
}
