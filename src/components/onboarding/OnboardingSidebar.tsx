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
    <div className="bg-slate-900 p-10 md:w-1/3 text-white flex flex-col justify-between relative overflow-hidden">
      <div className="relative z-10">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-600/20">
          <span className="font-bold text-2xl">H</span>
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tight text-white">Complete Your Profile</h2>
        <p className="text-slate-400 leading-relaxed text-sm">Personalize your experience and connect with our global health network.</p>
      </div>

      <div className="relative z-10 space-y-8 my-12">
        {steps.map((step) => (
          <StepIndicator 
            key={step.number} 
            number={step.number} 
            title={step.title} 
            current={currentStep} 
          />
        ))}
      </div>

      <div className="relative z-10 text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] opacity-50">
        HealthAI Platform &copy; 2026
      </div>

      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full -ml-32 -mb-32 blur-3xl" />
    </div>
  );
}

function StepIndicator({ number, title, current }: { number: number, title: string, current: number }) {
  const isCompleted = current > number;
  const isActive = current === number;

  return (
    <div className={`flex items-center gap-5 transition-all duration-500 ${isActive || isCompleted ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all duration-500 ${
        isCompleted 
          ? 'bg-emerald-500 text-white border-emerald-500 rotate-[360deg]' 
          : isActive 
            ? 'bg-blue-600 text-white border-blue-600 scale-110 shadow-lg shadow-blue-600/20' 
            : 'bg-transparent text-white border-white/30'
      }`}>
        {isCompleted ? <Check className="w-6 h-6" /> : number}
      </div>
      <span className={`font-bold tracking-tight text-sm ${isActive ? 'text-white' : 'text-slate-400'}`}>{title}</span>
    </div>
  );
}
