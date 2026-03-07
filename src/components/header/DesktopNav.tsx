'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { User } from 'firebase/auth';
import { NAVIGATION_LINKS } from '@/config/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, isExpertRole } from '@/types/user';
import { LayoutDashboard } from 'lucide-react';

interface DesktopNavProps {
  user: User | null;
  userProfile: UserProfile | null;
  t: any;
}

export default function DesktopNav({ user, userProfile, t }: DesktopNavProps) {
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
      
      {/* <div className="relative" ref={platformMenuRef}>
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
              {userProfile && isExpertRole(userProfile.role) && (
                <>
                  <MenuLink href="/expert/dashboard" label={t('profile.menu.expertConsole') || ''} icon="👨‍⚕️" />
                  <div className="my-2 border-t border-slate-50 dark:border-slate-800" />
                </>
              )}
              <MenuLink href="/seed" label="Standard Seed (V1)" icon="🌱" />
              <MenuLink href="/admin/seed" label="Admin Seed (V2)" icon="👑" />
              <div className="my-2 border-t border-slate-50 dark:border-slate-800" />
              <MenuLink href="/tools" label="Platform Dashboard" icon="🛠️" />
            </motion.div>
          )}
        </AnimatePresence>
      </div> */}

      {user && userProfile && isExpertRole(userProfile.role) && (
        <Link 
          href="/expert/dashboard" 
          className="group relative flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white dark:text-slate-900 overflow-hidden rounded-xl ml-8 whitespace-nowrap transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20"
        >
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-slate-900 dark:bg-white transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Glowing element */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          
          {/* Glass shine effect */}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[35deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />

          <div className="relative flex items-center gap-2">
            <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform duration-500" />
            {t('profile.menu.expertDashboard')}
          </div>
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
