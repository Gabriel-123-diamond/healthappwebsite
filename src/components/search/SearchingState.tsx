import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SearchingStateProps {
  t: any;
}

export const SearchingState: React.FC<SearchingStateProps> = ({ t }) => {
  return (
    <motion.div
      key="searching"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-20"
    >
      <div className="flex justify-center gap-4 mb-12">
        <div className="relative">
          <motion.div
            animate={{ 
              rotate: 360,
              borderRadius: ["30%", "50%", "30%"]
            }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 shadow-3xl shadow-blue-500/40 flex items-center justify-center relative z-10"
          >
            <Sparkles className="w-12 h-12 text-white" />
          </motion.div>
          {/* Orbiting particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 3 + i, ease: "linear" }}
              className="absolute inset-[-20px] border border-blue-500/20 rounded-full"
            >
              <div className="w-2 h-2 bg-blue-400 rounded-full absolute top-0 left-1/2 -translate-x-1/2 shadow-lg shadow-blue-500/50" />
            </motion.div>
          ))}
        </div>
      </div>
      <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">{t('common.synthesizingIntelligence')}</h2>
      <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">{t('common.synthesizingSubtitle')}</p>
    </motion.div>
  );
};
