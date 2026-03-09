import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronRight, Check } from 'lucide-react';

interface LanguageSelectorProps {
  showLanguages: boolean;
  setShowLanguages: (val: boolean) => void;
  locale: string;
  languages: { code: string; label: string; flag: string }[];
  handleLocaleChange: (code: string) => void;
}

export function LanguageSelector({
  showLanguages,
  setShowLanguages,
  locale,
  languages,
  handleLocaleChange,
}: LanguageSelectorProps) {
  return (
    <div className="space-y-4">
      <button 
        onClick={() => setShowLanguages(!showLanguages)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
            <Globe size={16} className="text-blue-500" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">Language</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {languages.find(l => l.code === locale)?.label}
          </span>
          <ChevronRight size={16} className={`text-slate-300 transition-transform duration-300 ${showLanguages ? 'rotate-90' : ''}`} />
        </div>
      </button>

      <AnimatePresence>
        {showLanguages && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden grid grid-cols-2 gap-2"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLocaleChange(lang.code)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                  locale === lang.code 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400'
                }`}
              >
                <span>{lang.flag} {lang.label}</span>
                {locale === lang.code && <Check size={12} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
