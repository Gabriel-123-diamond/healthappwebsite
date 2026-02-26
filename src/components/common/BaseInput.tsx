'use client';

import React, { forwardRef, useState, useEffect } from 'react';

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  labelClassName?: string;
  containerClassName?: string;
}

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(({
  id,
  label,
  error,
  prefixIcon,
  suffixIcon,
  labelClassName = "text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-2",
  containerClassName = "",
  className = "",
  ...props
}, ref) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={`w-full group ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative transition-all duration-300 transform group-hover:scale-[1.01]">
        {prefixIcon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {prefixIcon}
          </div>
        )}
        <input
          ref={ref}
          id={id}
          className={`appearance-none rounded-2xl relative block w-full ${prefixIcon ? 'pl-12' : 'px-5'} ${suffixIcon ? 'pr-12' : 'pr-5'} py-4 border-2 border-transparent bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 font-bold text-sm transition-all shadow-sm hover:shadow-md ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''} ${className}`}
          // We suppress hydration warning because password managers and extensions 
          // often inject styles or buttons directly into input fields
          suppressHydrationWarning
          {...props}
        />
        {suffixIcon && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400">
            {suffixIcon}
          </div>
        )}
      </div>
      {mounted && error && (
        <p className="mt-2 text-[10px] font-bold text-red-500 ml-1 uppercase tracking-wider flex items-center gap-1 animate-pulse">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block" /> {error}
        </p>
      )}
    </div>
  );
});

BaseInput.displayName = 'BaseInput';
