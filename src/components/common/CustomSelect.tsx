'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import SearchInput from './SearchInput';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string, label: string }[];
  placeholder: string;
}

export default function CustomSelect({ value, onChange, options, placeholder }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const selectedLabel = useMemo(() => 
    options.find(o => o.value === value)?.label || placeholder
  , [options, value, placeholder]);

  const filteredOptions = useMemo(() => 
    options.filter(o => 
      o.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
      o.value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  , [options, searchTerm]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-5 rounded-2xl bg-white border border-slate-100 flex items-center justify-between outline-none transition-all font-black text-slate-900 shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/5 ${isOpen ? 'border-blue-500 ring-4 ring-blue-500/5' : ''}`}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-400 font-normal'}>
          {selectedLabel}
        </span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute top-full mt-3 left-0 w-full min-w-[280px] bg-white rounded-3xl border border-slate-100 shadow-2xl z-50 max-h-[400px] overflow-hidden flex flex-col p-3"
          >
            <div className="mb-3">
              <SearchInput 
                autoFocus
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 space-y-1 px-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {filteredOptions.length > 0 ? filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                    value === option.value 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-700 hover:bg-slate-50 hover:pl-6'
                  }`}
                >
                  <span>{option.label}</span>
                  {value === option.value && <Check className="w-4 h-4" />}
                </button>
              )) : (
                <div className="py-12 text-center space-y-3">
                  <div className="p-3 bg-slate-50 rounded-2xl w-fit mx-auto">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">No matching results</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
