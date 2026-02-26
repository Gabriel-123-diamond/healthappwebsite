'use client';

import React from 'react';

interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  activeClass?: string;
}

export const FilterButton: React.FC<FilterButtonProps> = ({ 
  label, 
  isActive, 
  onClick,
  activeClass = "bg-blue-600 text-white"
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
        isActive 
          ? activeClass 
          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
      }`}
    >
      {label}
    </button>
  );
};
