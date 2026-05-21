'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

interface DigitalDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

export default function DigitalDatePicker({
  value,
  onChange,
  label,
  error,
  required
}: DigitalDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const selectedDate = value ? new Date(value) : undefined;
  
  // Future dates restriction
  const today = new Date();

  // Custom CSS injection to heavily theme the calendar to our Tailwind design system dynamically
  useEffect(() => {
    const styleId = 'rdp-custom-styles-health-app';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .rdp-root {
          --rdp-accent-color: #2563eb;
          --rdp-accent-background-color: #eff6ff;
          margin: 0;
          font-weight: 600;
        }
        .dark .rdp-root {
          --rdp-accent-color: #3b82f6;
          --rdp-accent-background-color: rgba(59, 130, 246, 0.2);
          color: #f8fafc;
        }
        .rdp-dropdown {
          background-color: #f1f5f9;
          color: inherit;
          padding: 4px 8px;
          border-radius: 8px;
          font-weight: bold;
          border: 1px solid #e2e8f0;
          outline: none;
        }
        .dark .rdp-dropdown {
          background-color: #1e293b;
          border-color: #334155;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-800/50 border-2 ${error ? 'border-red-500' : 'border-slate-100 dark:border-white/5'} flex items-center justify-between outline-none transition-all font-bold text-slate-900 dark:text-white shadow-sm hover:border-blue-400/30 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 ${isOpen ? 'bg-white dark:bg-slate-900 border-blue-500/50 ring-4 ring-blue-500/10' : ''}`}
      >
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-slate-400" />
          <span className={`text-sm font-black ${selectedDate ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500"}`}>
            {selectedDate ? format(selectedDate, 'PPP') : "Select your date of birth"}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-full mt-2 left-0 sm:left-auto bg-white dark:bg-slate-900 backdrop-blur-xl rounded-[24px] border border-slate-200/50 dark:border-slate-800 shadow-2xl z-50 p-4 sm:p-6"
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onChange(format(date, 'yyyy-MM-dd'));
                  setIsOpen(false);
                }
              }}
              disabled={[{ after: today }]}
              captionLayout="dropdown"
              startMonth={new Date(today.getFullYear() - 110, 0)}
              endMonth={today}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider flex items-center gap-1 animate-pulse">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {error}
        </p>
      )}
    </div>
  );
}
