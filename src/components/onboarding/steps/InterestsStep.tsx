import React from 'react';
import { motion } from 'framer-motion';
import { INTEREST_TOPICS } from '@/config/app_constants';
import { Sparkles, Heart } from 'lucide-react';

interface InterestsStepProps {
  formData: any;
  toggleInterest: (topic: string) => void;
}

export default function InterestsStep({ formData, toggleInterest }: InterestsStepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 sm:space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
          Step 7: Personalization
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your Interests</h3>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
          Select the health topics you care about most to curate your intelligence feed.
        </p>
      </div>

      <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-[32px] sm:rounded-[40px] border border-slate-100 dark:border-slate-700 p-6 sm:p-10 shadow-sm transition-colors duration-500">
        <div className="flex items-center gap-2 mb-8 text-slate-400 dark:text-slate-500">
          <Heart size={14} className="fill-current" />
          <span className="text-[10px] font-black uppercase tracking-widest">Select at least one topic</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {INTEREST_TOPICS.map((topic) => (
            <button 
              key={topic} 
              onClick={() => toggleInterest(topic)} 
              className={`p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] text-[10px] sm:text-sm font-black transition-all duration-300 border-2 text-center flex items-center justify-center min-h-[70px] sm:min-h-[90px] relative overflow-hidden group ${
                formData.interests.includes(topic) 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-xl scale-[1.02]' 
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-transparent hover:border-blue-200 dark:hover:border-blue-800 shadow-sm'
              }`}
            >
              <span className="relative z-10">{topic}</span>
              
              {formData.interests.includes(topic) && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute top-2 right-2 sm:top-3 sm:right-3"
                >
                  <Sparkles size={10} className="sm:w-3 sm:h-3 text-blue-400" />
                </motion.div>
              )}

              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-3xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 text-center">
          <p className="text-xs font-bold text-blue-600 dark:text-blue-400">
            Selected: <span className="text-blue-900 dark:text-blue-200 ml-1">{formData.interests.length} topics</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
