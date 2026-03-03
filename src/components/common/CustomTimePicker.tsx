'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Clock, ChevronDown, Keyboard, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CustomTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CustomTimePicker({
  value,
  onChange,
  placeholder = "Select Time",
  label
}: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [typedHours, setTypedHours] = useState('');
  const [typedMinutes, setTypedMinutes] = useState('');

  useClickOutside(containerRef, () => setIsOpen(false));

  const [hours, minutes] = useMemo(() => {
    if (!value) return [12, 0];
    const [h, m] = value.split(':').map(Number);
    return [h % 12 || 12, m];
  }, [value]);

  const [isPM, setIsPM] = useState(() => {
    if (!value) return false;
    const h = parseInt(value.split(':')[0]);
    return h >= 12;
  });

  useEffect(() => {
    setTypedHours(hours.toString().padStart(2, '0'));
    setTypedMinutes(minutes.toString().padStart(2, '0'));
  }, [hours, minutes]);

  const handleDigitalChange = (type: 'h' | 'm', val: string) => {
    const numeric = val.replace(/\D/g, '').slice(0, 2);
    if (type === 'h') {
      setTypedHours(numeric);
      const h = parseInt(numeric);
      if (h >= 1 && h <= 12) {
        const h24 = isPM ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
        onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
      }
    } else {
      setTypedMinutes(numeric);
      const m = parseInt(numeric);
      if (m >= 0 && m <= 59) {
        const h24 = isPM ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours);
        onChange(`${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return placeholder;
    const [hStr, mStr] = time.split(':');
    const h = parseInt(hStr);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${mStr} ${ampm}`;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-2">
          {label}
        </label>
      )}
      
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-5 py-4 bg-white dark:bg-slate-900 border-2 rounded-[24px] cursor-pointer transition-all duration-300 ${
          isOpen ? 'border-blue-500 ring-8 ring-blue-500/5 shadow-xl' : 
          'border-slate-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm'
        }`}
      >
        <div className={`p-2.5 rounded-xl transition-all duration-500 ${value ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 shadow-inner'}`}>
          <Clock size={18} strokeWidth={2.5} />
        </div>
        <span className={`text-sm font-black flex-1 truncate ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
          {formatDisplayTime(value)}
        </span>
        <ChevronDown size={18} className={`text-slate-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-4 left-0 z-50 bg-white/95 dark:bg-[#0B1221]/95 backdrop-blur-xl rounded-[40px] shadow-3xl border border-slate-100 dark:border-white/5 p-8 w-[340px] origin-top text-center overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* Digital Display */}
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-3">
                  <input 
                    type="text"
                    value={typedHours}
                    onChange={(e) => handleDigitalChange('h', e.target.value)}
                    className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[24px] text-4xl font-black text-blue-600 dark:text-blue-400 text-center outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner transition-all"
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Hours</span>
                </div>
                
                <span className="text-4xl font-black text-slate-200 mb-8">:</span>
                
                <div className="flex flex-col items-center gap-3">
                  <input 
                    type="text"
                    value={typedMinutes}
                    onChange={(e) => handleDigitalChange('m', e.target.value)}
                    className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[24px] text-4xl font-black text-blue-600 dark:text-blue-400 text-center outline-none focus:ring-4 focus:ring-blue-500/20 shadow-inner transition-all"
                  />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Minutes</span>
                </div>
                
                <div className="flex flex-col gap-2 mb-8 ml-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsPM(false);
                      const h24 = hours === 12 ? 0 : hours;
                      onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all ${!isPM ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                  >
                    AM
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setIsPM(true);
                      const h24 = hours === 12 ? 12 : hours + 12;
                      onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all ${isPM ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                  >
                    PM
                  </button>
                </div>
              </div>

              {/* Quick Select Slots */}
              <div className="pt-8 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={14} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Select</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 15, 30, 45].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        const h24 = isPM ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours);
                        onChange(`${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
                      }}
                      className={`py-3 rounded-xl text-[11px] font-black transition-all ${minutes === m ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                    >
                      :{m.toString().padStart(2, '0')}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all"
              >
                Set Time
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
