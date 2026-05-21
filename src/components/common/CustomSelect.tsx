'use client';

import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import SearchInput from './SearchInput';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string, label: string, key?: string }[];
  placeholder: string;
  className?: string;
  optionClassName?: string;
  disabled?: boolean;
  label?: string;
  labelClassName?: string;
  required?: boolean;
}

export default function CustomSelect({ 
  value, 
  onChange, 
  options, 
  placeholder, 
  className = "", 
  optionClassName = "",
  disabled = false,
  label,
  labelClassName = "text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-2",
  required
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  const selectedLabel = useMemo(() => 
    options.find(o => o.value === value)?.label || placeholder
  , [options, value, placeholder]);

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    
    const lowerSearch = searchTerm.toLowerCase();
    
    return options
      .filter(o => 
        o.label.toLowerCase().includes(lowerSearch) || 
        o.value.toLowerCase().includes(lowerSearch)
      )
      .sort((a, b) => {
        const aLabel = a.label.toLowerCase();
        const bLabel = b.label.toLowerCase();
        const aValue = a.value.toLowerCase();
        const bValue = b.value.toLowerCase();

        // 1. Exact matches first
        const aExact = aLabel === lowerSearch || aValue === lowerSearch;
        const bExact = bLabel === lowerSearch || bValue === lowerSearch;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;

        // 2. Starts with prefix second
        const aStarts = aLabel.startsWith(lowerSearch) || aValue.startsWith(lowerSearch);
        const bStarts = bLabel.startsWith(lowerSearch) || bValue.startsWith(lowerSearch);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        // 3. Otherwise maintain alphabetical order or original order
        return aLabel.localeCompare(bLabel);
      });
  }, [options, searchTerm]);

  return (
    <div className={`relative w-full ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} ref={containerRef}>
      {label && (
        <label className={labelClassName}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 rounded-[20px] bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-white/5 flex items-center justify-between outline-none transition-all font-bold text-slate-900 dark:text-white shadow-sm hover:border-blue-400/30 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-100/50 dark:focus:ring-blue-900/30 ${isOpen ? 'bg-white dark:bg-slate-900 border-blue-500/50 ring-4 ring-blue-500/10' : ''} ${className}`}
      >
        <span className={`truncate mr-2 text-sm font-black ${value ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
          {selectedLabel}
        </span>
        <div className={`p-0.5 rounded-full transition-colors ${isOpen ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute top-full mt-2 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[24px] border border-slate-200/50 dark:border-slate-700/50 shadow-2xl shadow-slate-200/50 dark:shadow-black/50 z-50 max-h-[600px] overflow-hidden flex flex-col p-2"
          >
            <div className="p-2">
              <SearchInput 
                autoFocus
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClear={() => setSearchTerm("")}
              />
            </div>
            <div className="overflow-y-auto flex-1 min-h-0 px-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-300 dark:hover:scrollbar-thumb-slate-600">
              {filteredOptions.length > 0 ? (
                <motion.div layout className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {filteredOptions.map((option, idx) => (
                      <motion.button
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        key={option.key || option.value + idx}
                        onClick={() => {
                          onChange(option.value);
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                          value === option.value 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        } ${optionClassName}`}
                      >
                        <span className="truncate">{option.label}</span>
                        {value === option.value && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                            <Check className="w-4 h-4" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">No results found</p>
                    <p className="text-xs text-slate-500 mt-1">Try searching for something else</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
