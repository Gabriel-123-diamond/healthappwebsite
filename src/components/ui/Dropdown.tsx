'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function Dropdown({ options, value, onChange, placeholder = 'Select...', className = '' }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-3.5 bg-white dark:bg-slate-900 border transition-all duration-300 rounded-2xl group h-full outline-none ${
          isOpen 
            ? 'border-blue-500 ring-4 ring-blue-500/5 shadow-lg shadow-blue-500/5' 
            : 'border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm'
        }`}
      >
        <span className="flex items-center gap-3 truncate">
          {selectedOption ? (
            <>
              {selectedOption.icon && <span className="text-blue-600 dark:text-blue-400">{selectedOption.icon}</span>}
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{placeholder}</span>
          )}
        </span>
        <div className={`p-1 rounded-lg transition-colors ${isOpen ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
          <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute z-[60] w-full mt-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-100 dark:border-slate-800 rounded-[24px] shadow-3xl shadow-blue-900/10 max-h-72 overflow-hidden flex flex-col p-2 min-w-[240px]"
          >
            <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              {options.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No Data Sectors Found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-left transition-all group ${
                        value === option.value 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-blue-600'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        {option.icon && (
                          <span className={value === option.value ? 'text-white' : 'text-slate-400 group-hover:text-blue-500 transition-colors'}>
                            {option.icon}
                          </span>
                        )}
                        <span className="text-[10px] font-black uppercase tracking-widest">{option.label}</span>
                      </div>
                      {value === option.value && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <Check className="w-4 h-4" strokeWidth={4} />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
