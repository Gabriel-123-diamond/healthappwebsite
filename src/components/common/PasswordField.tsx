'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { BaseInput } from './BaseInput';

interface PasswordFieldProps {
  id: string;
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  error?: string;
  prefixIcon?: React.ReactNode;
  labelClassName?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  autoComplete = 'current-password',
  className = '',
  error,
  prefixIcon = <Lock className="h-5 w-5 text-slate-400" />,
  labelClassName,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleIcon = (
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors focus:outline-none focus:text-blue-500 z-20"
      aria-label={showPassword ? "Hide password" : "Show password"}
      title={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
    </button>
  );

  return (
    <BaseInput
      id={id}
      name={name}
      type={showPassword ? 'text' : 'password'}
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      autoComplete={autoComplete}
      error={error}
      prefixIcon={prefixIcon}
      suffixIcon={toggleIcon}
      labelClassName={labelClassName}
      className={className}
    />
  );
};
