import React from 'react';
import { Link } from '@/i18n/routing';
import { ChevronRight, LucideIcon } from 'lucide-react';

interface ProfileMenuItemProps {
  href?: string;
  onClick?: () => void;
  icon: LucideIcon;
  label: string;
  subtitle?: string;
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'warning' | 'dark';
  disabled?: boolean;
  isLoading?: boolean;
  rightElement?: React.ReactNode;
}

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  href,
  onClick,
  icon: Icon,
  label,
  subtitle,
  variant = 'default',
  disabled,
  isLoading,
  rightElement
}) => {
  const baseClasses = "relative w-full flex flex-col items-start p-5 rounded-[28px] border transition-all duration-300 active:scale-[0.98] group/item overflow-hidden h-full min-h-[140px]";
  
  const variants = {
    default: "bg-slate-50/50 hover:bg-white dark:bg-slate-800/30 dark:hover:bg-white/[0.04] text-slate-700 dark:text-slate-200 border-transparent hover:border-blue-500/20 shadow-sm hover:shadow-xl hover:shadow-blue-500/5",
    primary: "bg-blue-600 text-white hover:bg-blue-700 border-blue-500 shadow-xl shadow-blue-600/20",
    success: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30",
    warning: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30",
    danger: "bg-red-50 hover:bg-red-100 dark:bg-red-500/5 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/10",
    dark: "bg-slate-900 hover:bg-slate-800 dark:bg-white/5 dark:hover:bg-white/10 text-white border-transparent",
  };

  const iconClasses = {
    default: "p-3 bg-white dark:bg-slate-800 rounded-2xl text-slate-400 group-hover/item:text-blue-500 group-hover/item:scale-110 transition-all shadow-sm border border-slate-100 dark:border-white/10",
    primary: "p-3 bg-white/20 rounded-2xl text-white group-hover/item:scale-110 transition-transform border border-white/20",
    success: "p-3 bg-emerald-500 rounded-2xl text-white group-hover/item:scale-110 transition-transform shadow-lg shadow-emerald-500/20",
    warning: "p-3 bg-amber-500 rounded-2xl text-white group-hover/item:scale-110 transition-transform shadow-lg shadow-amber-500/20",
    danger: "p-3 bg-white dark:bg-slate-800 text-red-500 rounded-2xl shadow-sm border border-red-100 dark:border-red-500/10 group-hover/item:scale-110 transition-transform",
    dark: "p-3 bg-white/10 rounded-2xl text-white group-hover/item:scale-110 transition-transform",
  };

  const content = (
    <>
      <div className="flex w-full items-start justify-between mb-4 relative z-10">
        <div className={iconClasses[variant as keyof typeof iconClasses] || iconClasses.default}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        {rightElement ? rightElement : (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${variant === 'primary' ? 'opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-1' : 'bg-slate-100 dark:bg-white/5 opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0'}`}>
            <ChevronRight size={14} className={variant === 'primary' ? 'text-white' : 'text-slate-400 group-hover/item:text-blue-500'} />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1.5 w-full text-left mt-auto relative z-10">
        <span className="font-black text-[10px] sm:text-[11px] uppercase tracking-widest leading-tight">{label}</span>
        {subtitle && <span className={`text-[9px] font-bold uppercase tracking-tight line-clamp-2 leading-relaxed ${variant === 'primary' ? 'text-blue-100' : 'text-slate-400'}`}>{subtitle}</span>}
      </div>
      
      {/* Background glow hover effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity pointer-events-none" />
      
      {variant === 'primary' && (
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 blur-[30px] rounded-full group-hover/item:scale-150 transition-transform duration-700 pointer-events-none" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${variants[variant as keyof typeof variants]}`}>
        {content}
      </Link>
    );
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || isLoading} 
      className={`${baseClasses} ${variants[variant as keyof typeof variants]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed scale-100 hover:scale-100' : ''}`}
    >
      {content}
    </button>
  );
};
