'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface NoSpacesScreamModalProps {
  isVisible: boolean;
}

export default function NoSpacesScreamModal({ isVisible }: NoSpacesScreamModalProps) {
  const t = useTranslations('onboarding.identity');
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1.1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -20 }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[200] bg-red-600 text-white px-8 py-6 rounded-[40px] shadow-3xl flex flex-col items-center gap-4 border-4 border-white/20 backdrop-blur-xl w-[90%] max-w-[400px]"
        >
          <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ repeat: Infinity, duration: 0.2 }}>
            <X className="w-16 h-16" strokeWidth={4} />
          </motion.div>
          <span className="text-2xl font-black uppercase tracking-tighter text-center">{t('noSpacesScream')}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
