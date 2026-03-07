'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, FileText, Brain, Save, CheckCircle2, Wand2 } from 'lucide-react';

interface AIScribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
}

export function AIScribeModal({ isOpen, onClose, patientName }: AIScribeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'idle' | 'transcribing' | 'analyzing' | 'done'>('idle');
  const [notes, setNotes] = useState('');

  const mockTranscript = [
    "Patient reports persistent headaches for 3 days.",
    "Pain level 7/10, described as throbbing.",
    "Associated with light sensitivity.",
    "No history of migraines.",
    "Blood pressure recorded at 140/90.",
  ];

  const generateNotes = () => {
    setIsProcessing(true);
    setStep('transcribing');
    
    setTimeout(() => {
      setStep('analyzing');
      setTimeout(() => {
        setNotes(`
# CLINICAL NOTES - AI GENERATED
**Patient:** ${patientName}
**Date:** ${new Date().toLocaleDateString()}

## Subjective
Patient presents with a 3-day history of throbbing headaches (7/10 intensity). Reports photophobia. Denies prior migraine history.

## Objective
- BP: 140/90 mmHg
- General Appearance: Distressed due to pain.

## Assessment
1. Acute Headache - likely Tension vs Early Stage Migraine.
2. Elevated Blood Pressure - needs monitoring.

## Plan
1. Administer Ibuprofen 400mg.
2. Dark room rest.
3. Follow-up BP check in 2 hours.
        `);
        setStep('done');
        setIsProcessing(false);
      }, 2000);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">AI Clinical Scribe</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Automated Documentation Engine</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="p-8">
            {step === 'idle' && (
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Session Transcript Preview</h4>
                  <div className="space-y-3">
                    {mockTranscript.map((line, i) => (
                      <p key={i} className="text-sm font-medium text-slate-600 dark:text-slate-300 flex gap-3">
                        <span className="text-indigo-500 font-black">[{i+1}]</span> {line}
                      </p>
                    ))}
                  </div>
                </div>
                <button
                  onClick={generateNotes}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-500/10"
                >
                  <Wand2 className="w-5 h-5" />
                  Generate Clinical Notes
                </button>
              </div>
            )}

            {(step === 'transcribing' || step === 'analyzing') && (
              <div className="py-20 text-center space-y-8">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full" />
                   <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-10 h-10 text-indigo-600 animate-pulse" />
                   </div>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    {step === 'transcribing' ? 'Processing Voice...' : 'Analyzing Medical Data...'}
                  </h4>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">AI is extracting clinical entities and structuring SOAP notes</p>
                </div>
              </div>
            )}

            {step === 'done' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="p-6 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-[32px] border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-4 text-emerald-600">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Notes Successfully Generated</span>
                  </div>
                  <pre className="text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {notes}
                  </pre>
                </div>
                <div className="flex gap-4">
                   <button className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                     <FileText className="w-4 h-4" /> Export PDF
                   </button>
                   <button onClick={onClose} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20">
                     <Save className="w-4 h-4" /> Save to EHR
                   </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
