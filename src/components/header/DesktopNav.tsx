'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { User } from 'firebase/auth';

interface DesktopNavProps {
  user: User | null;
  t: any;
}

export default function DesktopNav({ user, t }: DesktopNavProps) {
  const [platformMenuOpen, setPlatformMenuOpen] = React.useState(false);
  const platformMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (platformMenuRef.current && !platformMenuRef.current.contains(event.target as Node)) {
        setPlatformMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link href="/" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.search')}</Link>
      <Link href="/directory" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.directory')}</Link>
      <Link href="/community" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.community')}</Link>
      <Link href="/chat" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.chat')}</Link>
      
      <div className="relative" ref={platformMenuRef}>
        <button
          onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
          className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
        >
          Platform
          <ChevronDown className={`w-4 h-4 transition-transform ${platformMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        {platformMenuOpen && (
          <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xl py-2 z-50">
            <Link href="/seed" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setPlatformMenuOpen(false)}>
              Standard Seed (V1)
            </Link>
            <Link href="/admin/seed" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800" onClick={() => setPlatformMenuOpen(false)}>
              Admin Seed (V2)
            </Link>
            <Link href="/tools" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 mt-1 pt-2" onClick={() => setPlatformMenuOpen(false)}>
              Tools Dashboard
            </Link>
          </div>
        )}
      </div>

      {user && (
        <Link href="/saved" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.saved')}</Link>
      )}
      <Link href="/about" className="text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors">{t('common.about')}</Link>
    </nav>
  );
}
