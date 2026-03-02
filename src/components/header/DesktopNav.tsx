'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { User } from 'firebase/auth';
import { NAVIGATION_LINKS } from '@/config/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
    <nav className="hidden xl:flex items-center gap-0.5 xl:gap-1">
      {NAVIGATION_LINKS.map((link) => (
        <Link 
          key={link.href} 
          href={link.href} 
          className="px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          {t(link.labelKey) || link.defaultLabel}
        </Link>
      ))}
      
      <div className="relative" ref={platformMenuRef}>
        <button
          onMouseEnter={() => setPlatformMenuOpen(true)}
          onClick={() => setPlatformMenuOpen(!platformMenuOpen)}
          className={`flex items-center gap-1.5 px-2.5 xl:px-4 py-2 text-xs xl:text-sm font-bold transition-all rounded-xl ${
            platformMenuOpen 
              ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
              : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
          }`}
        >
          Tools
          <ChevronDown className={`w-3 h-3 xl:w-3.5 xl:h-3.5 transition-transform duration-300 ${platformMenuOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {platformMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              onMouseLeave={() => setPlatformMenuOpen(false)}
              className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl py-3 z-50 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95"
            >
              <div className="px-4 py-2 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Development Tools</span>
              </div>
              <MenuLink href="/seed" label="Standard Seed (V1)" icon="🌱" />
              <MenuLink href="/admin/seed" label="Admin Seed (V2)" icon="👑" />
              <div className="my-2 border-t border-slate-50 dark:border-slate-800" />
              <MenuLink href="/tools" label="Platform Dashboard" icon="🛠️" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {user && (
        <Link href="/saved" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20">
          {t('common.saved')}
        </Link>
      )}
    </nav>
  );
}

function MenuLink({ href, label, icon }: { href: string, label: string, icon: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}
