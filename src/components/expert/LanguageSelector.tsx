'use client';

import React, { useState } from 'react';
import { Check, X, Search, ChevronDown, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  "English", "Spanish", "French", "German", "Chinese", "Arabic", 
  "Portuguese", "Russian", "Japanese", "Hindi", "Italian", "Korean",
  "Dutch", "Turkish", "Vietnamese", "Polish", "Thai", "Ukrainian"
];

interface LanguageSelectorProps {
  selectedLanguages: string[];
  onChange: (languages: string[]) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLanguages, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      onChange(selectedLanguages.filter(l => l !== lang));
    } else {
      onChange([...selectedLanguages, lang]);
    }
  };

  const filteredLangs = LANGUAGES.filter(l => 
    l.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-2">
        <Languages size={12} />
        Communication Languages
      </label>
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border text-left flex items-center justify-between transition-all ${
            isOpen 
              ? 'border-blue-500 ring-4 ring-blue-500/10' 
              : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {selectedLanguages.length > 0 ? (
              selectedLanguages.map(lang => (
                <span key={lang} className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase tracking-wide border border-blue-100 dark:border-blue-800">
                  {lang}
                </span>
              ))
            ) : (
              <span className="text-slate-400 font-bold text-sm">Select languages...</span>
            )}
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-blue-500' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-slate-50 dark:border-slate-800">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search languages..."
                    autoFocus
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border-none outline-none text-sm font-bold text-slate-900 dark:text-white placeholder:font-medium placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
                <div className="grid grid-cols-2 gap-1">
                  {filteredLangs.map(lang => {
                    const isSelected = selectedLanguages.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {lang}
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
                {filteredLangs.length === 0 && (
                  <div className="py-8 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                    No languages found
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
