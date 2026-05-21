import React from 'react';
import { Moon, Sun, LogIn, UserPlus, LogOut, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { UserProfile } from '@/types/user';

interface FooterControlsProps {
  loading: boolean;
  user: any;
  userProfile: UserProfile | null;
  isAdminAuthenticated: boolean;
  t: any;
  onClose: () => void;
  onSignOut: () => void;
  onToggleTheme: () => void;
  resolvedTheme?: string;
  mounted?: boolean;
}

export const FooterControls = ({
  loading,
  user,
  userProfile,
  isAdminAuthenticated,
  t,
  onClose,
  onSignOut,
  onToggleTheme,
  resolvedTheme,
  mounted
}: FooterControlsProps) => {
  return (
    <div className="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${mounted && resolvedTheme === 'dark' ? 'bg-indigo-500' : 'bg-amber-500'} animate-pulse`} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Appearance</span>
          </div>
          <button 
            onClick={onToggleTheme}
            className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl transition-all active:scale-90"
          >
            {mounted ? (
              resolvedTheme === 'dark' ? (
                <Moon size={18} className="text-indigo-400" />
              ) : (
                <Sun size={18} className="text-amber-500" />
              )
            ) : (
              <div className="w-5 h-5" />
            )}
          </button>
        </div>

        {!loading && !user && !isAdminAuthenticated ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <Link 
                href="/auth/signin" 
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black uppercase tracking-widest text-[10px] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm active:scale-95 transition-all"
                onClick={onClose}
              >
                <LogIn size={14} /> {t('common.signIn')}
              </Link>
              <Link 
                href="/auth/signup" 
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                onClick={onClose}
              >
                <UserPlus size={14} /> {t('common.getStarted')}
              </Link>
            </div>
            <Link 
              href="/admin/login"
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-slate-900/50 text-slate-400 font-black uppercase tracking-widest text-[9px] border border-transparent rounded-xl active:scale-95 transition-all"
              onClick={onClose}
            >
              Admin Portal
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {(userProfile?.role === 'admin' || isAdminAuthenticated) && (
              <Link 
                href="/admin/dashboard"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl active:scale-95 transition-all"
              >
                <ShieldCheck size={16} className="text-emerald-500" />
                {t('header.adminConsole')}
              </Link>
            )}
            <button 
              onClick={onSignOut}
              className="w-full flex items-center justify-center gap-2 py-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black uppercase tracking-widest text-[10px] border border-red-100 dark:border-red-900/20 rounded-2xl active:scale-95 transition-all"
            >
              <LogOut size={14} /> {t('common.signOut')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
