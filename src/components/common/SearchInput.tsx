'use client';

import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export default function SearchInput({ className = '', onClear, value, ...props }: SearchInputProps) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 group-focus-within:bg-blue-50 dark:group-focus-within:bg-blue-900/30 transition-colors">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
      </div>
      <input 
        {...props}
        value={value}
        className={`w-full pl-12 ${onClear && value ? 'pr-12' : 'pr-4'} py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 placeholder:font-medium transition-all ${className}`}
      />
      {onClear && value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
