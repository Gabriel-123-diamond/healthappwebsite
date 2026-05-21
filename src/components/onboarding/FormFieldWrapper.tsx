import React from 'react';

interface FormFieldWrapperProps {
  label: string;
  icon?: React.ReactNode;
  isRequired?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({ 
  label, 
  icon, 
  isRequired = false, 
  children,
  className = ""
}) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        {icon}
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </span>
      </div>
      {children}
    </div>
  );
};
