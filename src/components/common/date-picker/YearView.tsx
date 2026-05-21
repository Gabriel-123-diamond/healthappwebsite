import React from 'react';
import { getYear } from 'date-fns';

interface YearViewProps {
  currentMonth: Date;
  years: number[];
  handleYearSelect: (year: number) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function YearView({ currentMonth, years, handleYearSelect, minDate, maxDate }: YearViewProps) {
  const isYearDisabled = (y: number) => {
    if (minDate && y < minDate.getFullYear()) return true;
    if (maxDate && y > maxDate.getFullYear()) return true;
    return false;
  };

  return (
    <div className="grid grid-cols-4 gap-2 max-h-[260px] overflow-y-auto custom-scrollbar p-1 relative z-10 scroll-smooth">
      {years.map((y) => {
        const disabled = isYearDisabled(y);
        return (
          <button
            type="button"
            key={y}
            onClick={() => !disabled && handleYearSelect(y)}
            disabled={disabled}
            className={`py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
              getYear(currentMonth) === y 
                ? 'bg-blue-600 text-white shadow-md' 
                : disabled
                  ? 'text-slate-200 dark:text-slate-800 cursor-not-allowed opacity-30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
            }`}
          >
            {y}
          </button>
        );
      })}
    </div>
  );
}
