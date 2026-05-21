'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, LogIn, UserPlus, ChevronRight, Activity, LogOut, ShieldCheck } from 'lucide-react';
import { Link, useRouter, usePathname } from '@/i18n/routing';
import { User as AuthUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Variants } from 'framer-motion';
import { UserProfile } from '@/types/user';
import { LanguageSelector } from './mobile/LanguageSelector';
import { NavigationLinks } from './mobile/NavigationLinks';
import { UtilityGrid } from './mobile/UtilityGrid';
import { UserProfileHeader } from './mobile/UserProfileHeader';
import { FooterControls } from './mobile/FooterControls';
import VipUpgradeButton from './VipUpgradeButton';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  locale: string;
  t: any;
  resolvedTheme?: string;
  onToggleTheme: () => void;
  mounted?: boolean;
  isAdminAuthenticated?: boolean;
}

const containerVariants: Variants = {
  closed: { 
    opacity: 0,
    x: '100%',
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  open: { 
    opacity: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  closed: { opacity: 0, x: 20 },
  open: { opacity: 1, x: 0 }
};

export default function MobileMenu({
  isOpen,
  onClose,
  user,
  userProfile,
  loading,
  locale,
  t,
  resolvedTheme,
  onToggleTheme,
  mounted,
  isAdminAuthenticated
}: MobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showLanguages, setShowLanguages] = React.useState(false);

  const handleSignOut = async () => {
    try {
      sessionStorage.removeItem('isAdminAuthenticated');
      await signOut(auth);
      onClose();
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleLocaleChange = (newLocale: string) => {
    localStorage.setItem('language', newLocale);
    router.push(pathname, { locale: newLocale });
    setShowLanguages(false);
    onClose();
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={containerVariants}
          initial="closed"
          animate="open"
          exit="closed"
          className="xl:hidden fixed inset-0 z-[100] bg-white dark:bg-slate-950 flex flex-col"
        >
          {/* Top Bar inside Fullscreen Menu */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity size={18} className="text-white" />
              </div>
              <span className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">Ikiké Menu</span>
            </div>
            <div className="flex items-center gap-2">
              <VipUpgradeButton userProfile={userProfile} />
              <button 
                onClick={onClose}
                className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 active:scale-90 transition-all"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10 custom-scrollbar">
            {/* User Profile Section if Logged In */}
            {user && (
              <UserProfileHeader 
                user={user} 
                userProfile={userProfile} 
                t={t} 
                onClose={onClose} 
                itemVariants={itemVariants} 
              />
            )}

            <motion.div variants={itemVariants}>
              <LanguageSelector 
                showLanguages={showLanguages}
                setShowLanguages={setShowLanguages}
                locale={locale}
                languages={languages}
                handleLocaleChange={handleLocaleChange}
              />
            </motion.div>

            <NavigationLinks t={t} onClose={onClose} itemVariants={itemVariants} userProfile={userProfile} />

            <UtilityGrid userProfile={userProfile} t={t} onClose={onClose} itemVariants={itemVariants} />
          </div>

          {/* Footer Controls */}
          <FooterControls 
            loading={loading}
            user={user}
            userProfile={userProfile}
            isAdminAuthenticated={!!isAdminAuthenticated}
            t={t}
            onClose={onClose}
            onSignOut={handleSignOut}
            onToggleTheme={onToggleTheme}
            resolvedTheme={resolvedTheme}
            mounted={mounted}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
