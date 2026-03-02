'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Clock, ChevronDown, Keyboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useClickOutside } from '@/hooks/useClickOutside';

interface CustomAnalogTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

export default function CustomAnalogTimePicker({
  value,
  onChange,
  placeholder = "Select Time",
  label
}: CustomAnalogTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<SVGSVGElement>(null);
  
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

  const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!clockRef.current) return;
    
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    const dist = Math.sqrt(x*x + y*y);
    const radius = rect.width / 2;

    let finalH = hours;
    let finalM = minutes;

    if (dist < radius * 0.6) {
      finalH = Math.floor(angle / 30) % 12 || 12;
    } else {
      finalM = Math.round(angle / 6) % 60;
      finalM = Math.round(finalM / 5) * 5; 
      if (finalM === 60) finalM = 0;
    }

    const h24 = isPM ? (finalH === 12 ? 12 : finalH + 12) : (finalH === 12 ? 0 : finalH);
    onChange(`${h24.toString().padStart(2, '0')}:${finalM.toString().padStart(2, '0')}`);
  };

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
            className="absolute top-full mt-4 left-0 z-50 bg-white/95 dark:bg-[#0B1221]/95 backdrop-blur-xl rounded-[48px] shadow-3xl border border-slate-100 dark:border-white/5 p-8 w-[340px] origin-top text-center overflow-hidden"
          >
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

            {/* Editable Digital Display */}
            <div className="relative z-10 flex items-center justify-center gap-4 mb-10">
              <div className="flex flex-col items-center gap-2">
                <input 
                  type="text"
                  value={typedHours}
                  onChange={(e) => handleDigitalChange('h', e.target.value)}
                  className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl text-3xl font-black text-blue-600 dark:text-blue-400 text-center outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Hours</span>
              </div>
              
              <span className="text-3xl font-black text-slate-200 mb-6">:</span>
              
              <div className="flex flex-col items-center gap-2">
                <input 
                  type="text"
                  value={typedMinutes}
                  onChange={(e) => handleDigitalChange('m', e.target.value)}
                  className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl text-3xl font-black text-blue-600 dark:text-blue-400 text-center outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                />
                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Minutes</span>
              </div>
              
              <div className="flex flex-col gap-1.5 ml-2 mb-6">
                <button 
                  onClick={() => {
                    setIsPM(false);
                    const h24 = hours === 12 ? 0 : hours;
                    onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${!isPM ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                  AM
                </button>
                <button 
                  onClick={() => {
                    setIsPM(true);
                    const h24 = hours === 12 ? 12 : hours + 12;
                    onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                  }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${isPM ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Analog Clock */}
            <div className="relative group cursor-crosshair z-10">
              <svg 
                ref={clockRef}
                viewBox="0 0 200 200" 
                className="w-full h-full"
                onClick={handleClockClick}
              >
                <circle cx="100" cy="100" r="98" className="fill-slate-50/50 dark:fill-slate-800/30 stroke-slate-100 dark:stroke-white/5 stroke-1" />
                <circle cx="100" cy="100" r="90" className="fill-white dark:fill-slate-900 shadow-sm" />
                
                {/* Numbers */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
                  const angle = (i * 30) * (Math.PI / 180);
                  const x = 100 + Math.sin(angle) * 72;
                  const y = 100 - Math.cos(angle) * 72 + 4;
                  return (
                    <text 
                      key={n} 
                      x={x} y={y} 
                      textAnchor="middle" 
                      className="fill-slate-300 dark:fill-slate-600 text-[11px] font-black pointer-events-none group-hover:fill-slate-400 transition-colors"
                    >
                      {n}
                    </text>
                  );
                })}

                {/* Hour Hand */}
                <motion.line 
                  initial={false}
                  animate={{ 
                    x2: 100 + Math.sin((hours * 30 + minutes / 2) * (Math.PI / 180)) * 45,
                    y2: 100 - Math.cos((hours * 30 + minutes / 2) * (Math.PI / 180)) * 45
                  }}
                  x1="100" y1="100"
                  className="stroke-slate-900 dark:stroke-white stroke-[6] stroke-linecap-round"
                />

                {/* Minute Hand */}
                <motion.line 
                  initial={false}
                  animate={{ 
                    x2: 100 + Math.sin(minutes * 6 * (Math.PI / 180)) * 65,
                    y2: 100 - Math.cos(minutes * 6 * (Math.PI / 180)) * 65
                  }}
                  x1="100" y1="100"
                  className="stroke-blue-600 stroke-[4] stroke-linecap-round"
                />
                
                <circle cx="100" cy="100" r="5" className="fill-blue-600 stroke-white dark:stroke-slate-900 stroke-2" />
              </svg>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex gap-1.5">
                {[0, 15, 30, 45].map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      const h24 = isPM ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours);
                      onChange(`${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black transition-all ${minutes === m ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-50'}`}
                  >
                    :{m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <Keyboard size={12} />
                Digital
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
