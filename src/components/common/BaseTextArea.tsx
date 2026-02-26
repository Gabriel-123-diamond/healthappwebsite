'use client';

import React from 'react';

interface BaseTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  error?: string;
  labelClassName?: string;
  containerClassName?: string;
  helperText?: string;
}

export const BaseTextArea: React.FC<BaseTextAreaProps> = ({
  id,
  label,
  error,
  labelClassName = "text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-1",
  containerClassName = "",
  className = "",
  helperText,
  ...props
}) => {
  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className={labelClassName}>
          {label} {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${className}`}
        {...props}
      />
      {helperText && <p className="mt-1 text-xs text-slate-500 text-right">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};
