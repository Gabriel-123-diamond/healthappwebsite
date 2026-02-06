'use client';

import React from 'react';
import { Check } from 'lucide-react';

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
    <div className="bg-slate-900 p-6 sm:p-10 md:w-1/3 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
      <div className="relative z-10">
        <div className="flex items-center md:block gap-3 mb-6 md:mb-8">
          <div className="w-8 h-8 sm:w-14 sm:h-14 bg-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 shrink-0">
            <span className="font-bold text-lg sm:text-2xl">H</span>
          </div>
          <div className="md:mt-0">
            <h2 className="text-lg sm:text-3xl font-black tracking-tight text-white leading-none">Complete Profile</h2>
            <p className="text-slate-400 leading-relaxed text-[10px] sm:text-sm hidden sm:block mt-2">Personalize your experience and connect with our global health network.</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex md:flex-col overflow-x-auto md:overflow-x-visible no-scrollbar gap-6 md:space-y-8 my-4 md:my-12 pb-2 md:pb-0 border-b md:border-b-0 border-white/5">
        {steps.map((step) => (
          <StepIndicator 
            key={step.number} 
            number={step.number} 
            title={step.title} 
            current={currentStep} 
          />
        ))}
      </div>

      <div className="relative z-10 text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-50 hidden md:block">
        HealthAI Platform &copy; 2026
      </div>

      {/* Decorative gradients - Smaller on mobile */}
      <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-blue-600/10 rounded-full -mr-16 -mt-16 sm:-mr-32 sm:-mt-32 blur-2xl sm:blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-indigo-600/10 rounded-full -ml-16 -mb-16 sm:-ml-32 sm:-mb-32 blur-2xl sm:blur-3xl" />
    </div>
  );
}

function StepIndicator({ number, title, current }: { number: number, title: string, current: number }) {
  const isCompleted = current > number;
  const isActive = current === number;

  return (
    <div className={`flex items-center gap-3 sm:gap-5 transition-all duration-500 shrink-0 ${isActive || isCompleted ? 'opacity-100 md:translate-x-2' : 'opacity-40'}`}>
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm border-2 transition-all duration-500 ${
        isCompleted 
          ? 'bg-emerald-500 text-white border-emerald-500 rotate-[360deg]' 
          : isActive 
            ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg shadow-blue-600/20' 
            : 'bg-transparent text-white border-white/30'
      }`}>
        {isCompleted ? <Check className="w-4 h-4 sm:w-6 sm:h-6" /> : number}
      </div>
      <span className={`font-bold tracking-tight text-xs sm:text-sm whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-400'}`}>{title}</span>
    </div>
  );
}
