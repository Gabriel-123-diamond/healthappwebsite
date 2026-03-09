import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { NAVIGATION_LINKS } from '@/config/navigation';

interface NavigationLinksProps {
  t: any;
  onClose: () => void;
  itemVariants: Variants;
}

export function NavigationLinks({ t, onClose, itemVariants }: NavigationLinksProps) {
  return (
    <div className="space-y-6">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Intelligence Grid</p>
      <nav className="flex flex-col gap-1">
        {NAVIGATION_LINKS.map((link) => (
          <motion.div key={link.href} variants={itemVariants}>
            <Link 
              href={link.href} 
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 group transition-all" 
              onClick={onClose}
            >
              <span className="text-xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight">
                {t(link.labelKey) || link.defaultLabel}
              </span>
              <ChevronRight size={20} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
            </Link>
          </motion.div>
        ))}
      </nav>
    </div>
  );
}
