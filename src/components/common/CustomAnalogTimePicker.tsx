'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Clock, ChevronDown } from 'lucide-react';
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

  const handleClockClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!clockRef.current) return;
    
    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Calculate angle in degrees
    let angle = Math.atan2(y, x) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    
    // Round to nearest 5 minutes for better UX
    const m = Math.round(angle / 6) % 60;
    const h = Math.floor(angle / 30) % 12 || 12;

    // Logic: If clicking near the center, set hours; otherwise, set minutes
    // For simplicity, we'll set both or toggle based on distance.
    // Let's just update based on where they click.
    const dist = Math.sqrt(x*x + y*y);
    const radius = rect.width / 2;

    let finalH = hours;
    let finalM = minutes;

    if (dist < radius * 0.6) {
      finalH = h;
    } else {
      finalM = Math.round(m / 5) * 5; // Snap to 5 mins
      if (finalM === 60) finalM = 0;
    }

    const h24 = isPM ? (finalH === 12 ? 12 : finalH + 12) : (finalH === 12 ? 0 : finalH);
    onChange(`${h24.toString().padStart(2, '0')}:${finalM.toString().padStart(2, '0')}`);
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
        className={`flex items-center gap-3 px-5 py-4 bg-slate-50 dark:bg-white/5 border-2 rounded-2xl cursor-pointer transition-all ${
          isOpen ? 'border-blue-500 ring-4 ring-blue-500/5 dark:ring-blue-500/10 bg-white dark:bg-slate-900' : 
          'border-transparent hover:border-blue-200 dark:hover:border-blue-800 shadow-sm'
        }`}
      >
        <div className={`p-2 rounded-lg transition-colors ${value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 shadow-sm'}`}>
          <Clock size={16} />
        </div>
        <span className={`text-sm font-bold flex-1 truncate ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
          {formatDisplayTime(value)}
        </span>
        <ChevronDown size={16} className={`text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full mt-3 left-0 z-50 bg-white dark:bg-[#0B1221] rounded-[40px] shadow-2xl border border-slate-100 dark:border-white/5 p-8 w-[320px] origin-top text-center"
          >
            {/* Digital Display */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums shadow-inner">
                {hours.toString().padStart(2, '0')}
              </div>
              <span className="text-2xl font-black text-slate-300">:</span>
              <div className="bg-slate-50 dark:bg-slate-800 px-4 py-3 rounded-2xl text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums shadow-inner">
                {minutes.toString().padStart(2, '0')}
              </div>
              
              <div className="flex flex-col gap-1 ml-2">
                <button 
                  onClick={() => {
                    setIsPM(false);
                    const h24 = hours === 12 ? 0 : hours;
                    onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${!isPM ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                  AM
                </button>
                <button 
                  onClick={() => {
                    setIsPM(true);
                    const h24 = hours === 12 ? 12 : hours + 12;
                    onChange(`${h24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${isPM ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Analog Clock */}
            <div className="relative group cursor-crosshair">
              <svg 
                ref={clockRef}
                viewBox="0 0 200 200" 
                className="w-full h-full transform transition-transform"
                onClick={handleClockClick}
              >
                {/* Clock Face */}
                <circle cx="100" cy="100" r="95" className="fill-slate-50 dark:fill-slate-800/50 stroke-slate-100 dark:stroke-white/5 stroke-2" />
                <circle cx="100" cy="100" r="4" className="fill-blue-600 z-20" />

                {/* Hour Markers */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i * 30) * (Math.PI / 180);
                  const x1 = 100 + Math.sin(angle) * 80;
                  const y1 = 100 - Math.cos(angle) * 80;
                  const x2 = 100 + Math.sin(angle) * 90;
                  const y2 = 100 - Math.cos(angle) * 90;
                  return (
                    <line 
                      key={i} 
                      x1={x1} y1={y1} x2={x2} y2={y2} 
                      className="stroke-slate-300 dark:stroke-slate-600 stroke-2" 
                    />
                  );
                })}

                {/* Numbers */}
                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((n, i) => {
                  const angle = (i * 30) * (Math.PI / 180);
                  const x = 100 + Math.sin(angle) * 65;
                  const y = 100 - Math.cos(angle) * 65 + 4;
                  return (
                    <text 
                      key={n} 
                      x={x} y={y} 
                      textAnchor="middle" 
                      className="fill-slate-400 dark:fill-slate-500 text-[12px] font-black pointer-events-none"
                    >
                      {n}
                    </text>
                  );
                })}

                {/* Hour Hand */}
                <motion.line 
                  initial={false}
                  animate={{ 
                    x2: 100 + Math.sin((hours * 30 + minutes / 2) * (Math.PI / 180)) * 50,
                    y2: 100 - Math.cos((hours * 30 + minutes / 2) * (Math.PI / 180)) * 50
                  }}
                  x1="100" y1="100"
                  className="stroke-slate-900 dark:stroke-white stroke-[6] stroke-linecap-round"
                />

                {/* Minute Hand */}
                <motion.line 
                  initial={false}
                  animate={{ 
                    x2: 100 + Math.sin(minutes * 6 * (Math.PI / 180)) * 75,
                    y2: 100 - Math.cos(minutes * 6 * (Math.PI / 180)) * 75
                  }}
                  x1="100" y1="100"
                  className="stroke-blue-600 stroke-[4] stroke-linecap-round"
                />
              </svg>

              <div className="mt-8 grid grid-cols-4 gap-2">
                {[0, 15, 30, 45].map(m => (
                  <button
                    key={m}
                    onClick={() => {
                      const h24 = isPM ? (hours === 12 ? 12 : hours + 12) : (hours === 12 ? 0 : hours);
                      onChange(`${h24.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
                    }}
                    className={`py-2 rounded-xl text-[10px] font-black transition-all ${minutes === m ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600'}`}
                  >
                    :{m.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
