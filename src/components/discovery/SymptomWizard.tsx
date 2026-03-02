'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ArrowRight, ChevronLeft, ChevronRight, 
  Sparkles, AlertTriangle, ShieldCheck, Thermometer,
  Brain, Heart, Wind, Zap, RefreshCcw
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: { label: string; value: any }[];
}

const DISCOVERY_QUESTIONS: Question[] = [
  {
    id: 'primary',
    text: "Where do you feel the most discomfort?",
    options: [
      { label: "Head & Neck", value: "head" },
      { label: "Chest & Heart", value: "chest" },
      { label: "Abdomen & Digestion", value: "abdomen" },
      { label: "Limbs & Joints", value: "limbs" },
      { label: "Skin & External", value: "skin" },
    ]
  },
  {
    id: 'severity',
    text: "How would you describe the intensity?",
    options: [
      { label: "Mild (Manageable)", value: "mild" },
      { label: "Moderate (Uncomfortable)", value: "moderate" },
      { label: "Severe (Significant)", value: "severe" },
    ]
  },
  {
    id: 'duration',
    text: "How long has this been occurring?",
    options: [
      { label: "Just started (Hours)", value: "recent" },
      { label: "A few days", value: "days" },
      { label: "Over a week", value: "chronic" },
    ]
  }
];

export default function SymptomWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    if (step < DISCOVERY_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    setIsAnalyzing(true);
    // Simulate AI Discovery
    setTimeout(() => {
      setResult("Based on your inputs, this may be related to common fatigue or minor inflammation. We recommend consulting a Natural Wellness Practitioner for a holistic review or a Medical Doctor if symptoms persist.");
      setIsAnalyzing(false);
    }, 3000);
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setResult(null);
  };

  return (
    <div className="bg-white dark:bg-[#0B1221] rounded-[48px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-3xl">
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-12 text-white relative">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles size={12} />
            AI Discovery Wizard
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-2">Health Insight Engine</h2>
          <p className="text-blue-100 text-sm font-medium opacity-80">Discover potential paths to wellness through guided discovery.</p>
        </div>
        
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24" />
      </div>

      <div className="p-8 sm:p-12 min-h-[400px] flex flex-col">
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <motion.div 
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8 flex-1"
            >
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Step {step + 1} of {DISCOVERY_QUESTIONS.length}</span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {DISCOVERY_QUESTIONS[step].text}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {DISCOVERY_QUESTIONS[step].options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleAnswer(DISCOVERY_QUESTIONS[step].id, opt.value)}
                    className="group flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-3xl border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all text-left active:scale-[0.98]"
                  >
                    <span className="font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{opt.label}</span>
                    <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center py-12"
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <Activity className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Processing Signals</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">Our AI is cross-referencing your inputs with medical and herbal knowledge bases.</p>
            </motion.div>
          )}

          {result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex-1 space-y-8"
            >
              <div className="p-8 bg-emerald-50 dark:bg-emerald-900/10 rounded-[32px] border border-emerald-100 dark:border-emerald-900/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <ShieldCheck size={80} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} /> Discovery Summary
                </h3>
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic text-lg">
                  "{result}"
                </p>
              </div>

              <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex gap-4">
                <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
                <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider leading-relaxed">
                  Important: This is not a medical diagnosis. It is an educational discovery tool. Always seek professional advice for health concerns.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={() => window.location.href = '/directory'}
                  className="flex-1 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Consult a Specialist
                </button>
                <button 
                  onClick={reset}
                  className="flex-1 py-5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCcw size={14} /> Start Over
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
