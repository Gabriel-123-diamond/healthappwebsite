'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface Step {
  number: number;
  title: string;
}

interface OnboardingSidebarProps {
  currentStep: number;
  steps: Step[];
}

export default function OnboardingSidebar({ currentStep, steps }: OnboardingSidebarProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 p-8 sm:p-12 md:w-1/3 text-slate-900 dark:text-white flex flex-col justify-between relative overflow-hidden shrink-0 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 transition-colors duration-500">
      <div className="relative z-10">
        <div className="flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-8 mb-12">
          <div className="relative">
            <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-[24px] flex items-center justify-center shadow-2xl shadow-blue-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-500 group cursor-default">
              <span className="font-black text-3xl sm:text-4xl text-white group-hover:scale-110 transition-transform">I</span>
            </div>
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -bottom-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500 border-4 border-white dark:border-slate-950 rounded-full flex items-center justify-center shadow-sm"
            >
              <Sparkles size={12} className="text-white" />
            </motion.div>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Elevate Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Health Journey</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed text-xs sm:text-sm max-w-[220px] hidden sm:block opacity-80">
              Personalize your intelligence feed and connect with verified specialists worldwide.
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar gap-8 md:space-y-10 my-8 md:my-0 pb-4 md:pb-0 relative">
        {/* Connection line for desktop */}
        <div className="hidden md:block absolute left-[27px] top-4 bottom-4 w-[2px] bg-slate-200 dark:bg-white/10 z-0">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            className="w-full bg-blue-600 transition-all duration-700"
          />
        </div>

        {steps.map((step) => (
          <StepIndicator 
            key={step.number} 
            number={step.number} 
            title={step.title} 
            current={currentStep} 
          />
        ))}
      </div>

      <div className="relative z-10 mt-12 pt-8 border-t border-slate-200 dark:border-white/5 hidden md:block">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Platform Encrypted</span>
        </div>
      </div>

      {/* Decorative gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-blue-600/5 dark:bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-indigo-600/5 dark:bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}

function StepIndicator({ number, title, current }: { number: number, title: string, current: number }) {
  const isCompleted = current > number;
  const isActive = current === number;

  return (
    <div className={`flex items-center gap-4 sm:gap-6 transition-all duration-500 shrink-0 ${isActive || isCompleted ? 'opacity-100 md:translate-x-2' : 'opacity-30'}`}>
      <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-[18px] sm:rounded-[22px] flex items-center justify-center font-black text-sm sm:text-xl border-2 transition-all duration-700 ${
        isCompleted 
          ? 'bg-emerald-500 text-white border-emerald-400 rotate-[360deg] shadow-lg shadow-emerald-500/30' 
          : isActive 
            ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-blue-600 dark:border-white scale-110 shadow-2xl shadow-blue-500/20' 
            : 'bg-transparent text-slate-400 dark:text-white border-slate-200 dark:border-white/20'
      }`}>
        {isCompleted ? <Check className="w-5 h-5 sm:w-7 sm:h-7" strokeWidth={4} /> : number}
      </div>
      <div className="flex flex-col">
        <span className={`font-black tracking-widest text-[10px] sm:text-xs uppercase mb-1 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>
          Step {number}
        </span>
        <span className={`font-bold tracking-tight text-sm sm:text-lg whitespace-nowrap ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
          {title}
        </span>
      </div>
    </div>
  );
}
