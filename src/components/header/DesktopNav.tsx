'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { ChevronDown } from 'lucide-react';
import { User } from 'firebase/auth';
import { NAVIGATION_LINKS, EXPERT_NAV_LINKS, HOSPITAL_NAV_LINKS, NavLink } from '@/config/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, isExpertRole } from '@/types/user';
import { LayoutDashboard, ShieldCheck } from 'lucide-react';

interface DesktopNavProps {
  user: User | null;
  userProfile: UserProfile | null;
  t: any;
}

export default function DesktopNav({ user, userProfile, t }: DesktopNavProps) {
  const [platformMenuOpen, setPlatformMenuOpen] = React.useState(false);
  const [coursesMenuOpen, setCoursesMenuOpen] = React.useState(false);
  const [hospitalMenuOpen, setHospitalMenuOpen] = React.useState(false);
  const platformMenuRef = React.useRef<HTMLDivElement>(null);
  const coursesMenuRef = React.useRef<HTMLDivElement>(null);
  const hospitalMenuRef = React.useRef<HTMLDivElement>(null);

  const getVisibleLinks = (): NavLink[] => {
    const role = userProfile?.role || 'user';
    
    // 1. Get base links filtered by role
    let baseLinks = NAVIGATION_LINKS.filter(link => 
      !link.roles || link.roles.includes(role)
    );

    // If user is not authenticated, hide /chat link
    if (!user) {
      baseLinks = baseLinks.filter(link => link.href !== '/chat');
    }

    // 2. Prepend role-specific dashboard links
    if (role === 'hospital') {
      const operationsLink: NavLink = {
        href: '/hospital/operations',
        labelKey: 'hospital.operations',
        defaultLabel: 'Operations',
      };
      return [operationsLink, ...baseLinks];
    }
    
    if (isExpertRole(role) && role !== 'admin') {
      return [...EXPERT_NAV_LINKS, ...baseLinks];
    }

    return baseLinks;
  };

  const visibleLinks = getVisibleLinks();

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (platformMenuRef.current && !platformMenuRef.current.contains(event.target as Node)) {
        setPlatformMenuOpen(false);
      }
      if (coursesMenuRef.current && !coursesMenuRef.current.contains(event.target as Node)) {
        setCoursesMenuOpen(false);
      }
      if (hospitalMenuRef.current && !hospitalMenuRef.current.contains(event.target as Node)) {
        setHospitalMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="hidden lg:flex items-center gap-0.5">
      {visibleLinks.map((link) => {
        if (link.href === '/hospital/operations') {
          return (
            <div className="relative" key={link.href} ref={hospitalMenuRef}>
              <button
                onMouseEnter={() => setHospitalMenuOpen(true)}
                onClick={() => setHospitalMenuOpen(!hospitalMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-2 text-xs xl:text-sm font-bold transition-all rounded-xl ${
                  hospitalMenuOpen 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                {t(link.labelKey) || link.defaultLabel}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${hospitalMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {hospitalMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseLeave={() => setHospitalMenuOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl py-3 z-50 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95"
                  >
                    <div className="px-4 py-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {t('hospital.operations') || 'Operations'}
                      </span>
                    </div>
                    {HOSPITAL_NAV_LINKS.map((subLink) => (
                      <MenuLink 
                        key={subLink.href}
                        href={subLink.href} 
                        label={t(subLink.labelKey) || subLink.defaultLabel} 
                        icon={
                          subLink.href.includes('registry') ? '📋' :
                          subLink.href.includes('staff') ? '👥' :
                          subLink.href.includes('departments') ? '🏥' :
                          subLink.href.includes('promote') ? '📣' :
                          '⚙️'
                        } 
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }

        if (link.href === '/learning' && user) {
          return (
            <div className="relative" key={link.href} ref={coursesMenuRef}>
              <button
                onMouseEnter={() => setCoursesMenuOpen(true)}
                onClick={() => setCoursesMenuOpen(!coursesMenuOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-2 text-xs xl:text-sm font-bold transition-all rounded-xl ${
                  coursesMenuOpen 
                    ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                }`}
              >
                {t(link.labelKey) || link.defaultLabel}
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${coursesMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {coursesMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseLeave={() => setCoursesMenuOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl py-3 z-50 backdrop-blur-xl bg-white/95 dark:bg-slate-900/95"
                  >
                    <div className="px-4 py-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('header.academy')}</span>
                    </div>
                    <MenuLink href="/learning" label={t('common.browseCourses')} icon="🎓" />
                    <MenuLink href="/learning?tab=enrolled" label={t('common.myEnrollments')} icon="📑" />
                    
                    {userProfile && isExpertRole(userProfile.role) && (
                      <>
                        <div className="my-2 border-t border-slate-50 dark:border-slate-800" />
                        <div className="px-4 py-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">{t('header.expertControls')}</span>
                        </div>
                        <MenuLink href="/expert/dashboard?tab=courses" label={t('common.myCreations')} icon="🛠️" />
                        <MenuLink href="/expert/courses/new" label={t('common.hostCourse')} icon="✨" />
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        }
        return (
          <Link 
            key={link.href} 
            href={link.href} 
            className="px-2.5 py-2 text-xs xl:text-sm font-bold text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
          >
            {t(link.labelKey) || link.defaultLabel}
          </Link>
        );
      })}

      {user && userProfile && userProfile.role === 'admin' && (
        <Link 
          href="/admin/dashboard" 
          className="group relative flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white overflow-hidden rounded-xl ml-4 whitespace-nowrap transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/20"
        >
          <div className="absolute inset-0 bg-white dark:bg-slate-900 transition-colors duration-500" />
          <div className="relative flex items-center gap-2 text-emerald-400 dark:text-emerald-600">
            <ShieldCheck size={14} className="group-hover:rotate-12 transition-transform duration-500" />
            {t('header.adminConsole')}
          </div>
        </Link>
      )}

      {!user && (
        <Link 
          href="/admin/login" 
          className="px-2.5 py-2 text-xs xl:text-sm font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-blue-400 transition-all rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 opacity-70 hover:opacity-100"
          title="System Administration"
        >
          {t('header.admin')}
        </Link>
      )}

      {user && userProfile && isExpertRole(userProfile.role) && userProfile.role !== 'admin' && (
        <Link 
          href={userProfile.role === 'hospital' ? '/hospital/dashboard' : '/expert/dashboard'} 
          className="group relative flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white overflow-hidden rounded-xl ml-8 whitespace-nowrap transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20"
        >
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-white dark:bg-slate-900 transition-colors duration-500" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Glowing element */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
          
          {/* Glass shine effect */}
          <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[35deg] group-hover:left-[150%] transition-all duration-1000 ease-in-out" />

          <div className="relative flex items-center gap-2">
            <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform duration-500" />
            {userProfile.role === 'hospital' ? 'Institutional Console' : t('profile.menu.expertDashboard')}
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
