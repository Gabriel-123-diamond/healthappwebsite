'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export default function SearchInput({ className = '', onClear, ...props }: SearchInputProps) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-slate-50 group-focus-within:bg-blue-50 transition-colors">
        <Search className="w-4 h-4 text-slate-400 group-focus-within:text-blue-500" />
      </div>
      <input 
        {...props}
        className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-medium transition-all ${className}`}
      />
    </div>
  );
}
