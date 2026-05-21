'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Check, Plus, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface InterestsStepProps {
  formData: any;
  toggleInterest: (interest: string) => void;
  toggleChronicCondition: (condition: string) => void;
  toggleFamilyHistory: (history: string) => void;
  toggleLifestyleGoal: (goal: string) => void;
}

export default function InterestsStep({ 
  formData, 
  toggleInterest,
  toggleChronicCondition,
  toggleFamilyHistory,
  toggleLifestyleGoal
}: InterestsStepProps) {
  const t = useTranslations('onboarding.interests');
  const [search, setSearch] = useState('');

  const sections = [
    {
      id: 'interests',
      title: t('title'),
      subtitle: t('subtitle'),
      items: ["Hypertension", "Diabetes", "Mental Health", "Nutrition", "Herbal Medicine", "Yoga", "Sleep Hygiene", "Heart Health", "Weight Loss", "Skin Care", "Gut Health", "Immunity"],
      selected: formData.interests,
      toggle: toggleInterest,
      icon: <BookOpen size={12} />,
      badge: "Knowledge Stream"
    },
    {
      id: 'conditions',
      title: t('chronicConditions'),
      subtitle: t('chronicConditionsSubtitle'),
      items: ["Asthma", "Arthritis", "Chronic Pain", "Depression", "Anxiety", "PCOS", "Thyroid", "Migraine", "None"],
      selected: formData.chronicConditions,
      toggle: toggleChronicCondition,
      badge: "Clinical Baseline"
    },
    {
      id: 'family',
      title: t('familyHistory'),
      subtitle: t('familyHistorySubtitle'),
      items: ["Cancer", "Heart Disease", "Stroke", "Alzheimer's", "Autoimmune", "None"],
      selected: formData.familyHistory,
      toggle: toggleFamilyHistory,
      badge: "Hereditary Map"
    },
    {
      id: 'goals',
      title: t('lifestyleGoals'),
      subtitle: t('lifestyleGoalsSubtitle'),
      items: ["Better Sleep", "Reduce Stress", "Build Muscle", "Healthy Aging", "More Energy", "Focus"],
      selected: formData.lifestyleGoals,
      toggle: toggleLifestyleGoal,
      badge: "Personal Growth"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 1.05 }} 
      className="space-y-16"
    >
      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('search')}
          className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent rounded-3xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 dark:text-white shadow-sm"
        />
      </div>

      {sections.map((section) => (
        <div key={section.id} className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20 shadow-sm">
              {section.icon || <Sparkles size={12} />}
              {section.badge}
            </div>
            
            <div className="space-y-1">
              <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                {section.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl">
                {section.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <AnimatePresence mode='popLayout'>
              {section.items.filter(i => i.toLowerCase().includes(search.toLowerCase())).map((item) => {
                const isSelected = section.selected.includes(item);
                return (
                  <motion.button
                    layout
                    key={item}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => section.toggle(item)}
                    className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30'
                        : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-white/5 hover:border-blue-500/30'
                    }`}
                  >
                    {item}
                    {isSelected ? <Check size={14} strokeWidth={4} /> : <Plus size={14} strokeWidth={4} className="opacity-40" />}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {(formData.interests.length > 0 || formData.chronicConditions.length > 0) && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-[32px] border border-blue-100 dark:border-blue-900/30 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Profile Depth</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">AI health routing optimized for your profile.</p>
            </div>
          </div>
          <span className="text-xl font-black text-blue-600 dark:text-blue-400">
            {formData.interests.length + formData.chronicConditions.length + formData.familyHistory.length + formData.lifestyleGoals.length}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
