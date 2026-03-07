'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { format, setMonth, setYear, startOfMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienceDatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allowPresent?: boolean;
}

export const ExperienceDatePicker: React.FC<ExperienceDatePickerProps> = ({ 
  label, 
  value, 
  onChange,
  allowPresent = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parse existing value: "MM/YYYY" or "Present"
  const currentDate = new Date();
  const [viewDate, setViewDate] = useState(value && value !== 'Present' ? new Date(parseInt(value.split('/')[1]), parseInt(value.split('/')[0]) - 1) : currentDate);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const years = Array.from({ length: 50 }, (_, i) => currentDate.getFullYear() - i);
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const handleSelect = (monthIdx: number, year: number) => {
    const monthStr = (monthIdx + 1).toString().padStart(2, '0');
    onChange(`${monthStr}/${year}`);
    setIsOpen(false);
  };

  const handlePresent = () => {
    onChange('Present');
    setIsOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block tracking-wider">{label}</label>
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl cursor-pointer hover:border-blue-500 transition-all"
      >
        <Calendar size={14} className="text-slate-400" />
        <span className={`text-sm ${value ? 'text-slate-900 dark:text-white font-medium' : 'text-slate-400'}`}>
          {value || 'Select Date'}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute z-50 mt-2 p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl min-w-[280px]"
          >
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => setViewDate(d => setYear(d, d.getFullYear() - 1))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="font-bold text-slate-900 dark:text-white">{viewDate.getFullYear()}</span>
              <button 
                onClick={() => setViewDate(d => setYear(d, d.getFullYear() + 1))}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {months.map((month, idx) => {
                const isSelected = value !== 'Present' && value.split('/')[0] === (idx + 1).toString().padStart(2, '0') && value.split('/')[1] === viewDate.getFullYear().toString();
                return (
                  <button
                    key={month}
                    onClick={() => handleSelect(idx, viewDate.getFullYear())}
                    className={`py-2 text-xs font-bold rounded-xl transition-colors ${
                      isSelected 
                        ? 'bg-blue-600 dark:bg-blue-500 text-white' 
                        : 'text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {month}
                  </button>
                );
              })}
            </div>

            {allowPresent && (
              <button
                onClick={handlePresent}
                className={`w-full mt-4 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl border-2 transition-all ${
                  value === 'Present'
                    ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 text-white'
                    : 'border-slate-100 dark:border-slate-700 text-slate-400 hover:border-blue-500 hover:text-blue-500'
                }`}
              >
                I currently work here
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
