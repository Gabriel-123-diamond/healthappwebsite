'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Pill, Search, User, FileText, CheckCircle2, Loader2, PenTool } from 'lucide-react';

interface EPrescribingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_MEDICATIONS = [
  'Amoxicillin 500mg',
  'Lisinopril 10mg',
  'Metformin 500mg',
  'Atorvastatin 20mg',
  'Albuterol HFA',
  'Gabapentin 300mg',
  'Sertraline 50mg',
  'Losartan 50mg'
];

export function EPrescribingModal({ isOpen, onClose }: EPrescribingModalProps) {
  const [step, setStep] = useState<'details' | 'signing' | 'done'>('details');
  const [patientName, setPatientName] = useState('');
  const [selectedMed, setSelectedMed] = useState('');
  const [dosage, setDosage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(res => setTimeout(res, 1500));
    setStep('done');
    setIsSubmitting(false);
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
          className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl overflow-hidden border border-slate-100 dark:border-slate-800"
        >
          <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Digital Prescription Pad</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">Secure E-Prescribing System</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="p-8">
            {step === 'details' && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Patient Node</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Enter patient name..."
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medication Search</label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      list="meds"
                      placeholder="Search approved drugs..."
                      value={selectedMed}
                      onChange={(e) => setSelectedMed(e.target.value)}
                      className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                    <datalist id="meds">
                      {COMMON_MEDICATIONS.map(m => <option key={m} value={m} />)}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Sig / Dosage Instructions</label>
                  <textarea
                    placeholder="e.g. Take 1 tablet by mouth daily for 7 days"
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    rows={3}
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-[20px] text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <button
                  disabled={!patientName || !selectedMed || !dosage}
                  onClick={() => setStep('signing')}
                  className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-blue-700 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20"
                >
                  Continue to Authorization
                </button>
              </div>
            )}

            {step === 'signing' && (
              <div className="space-y-8">
                <div className="p-8 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[32px] shadow-inner space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Prescription Review</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Patient: {patientName}</p>
                    </div>
                    <FileText className="w-8 h-8 text-blue-600/20" />
                  </div>
                  <div className="py-4 border-y border-slate-50 dark:border-slate-800 space-y-2">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{selectedMed}</p>
                    <p className="text-xs text-slate-500 leading-relaxed italic">{dosage}</p>
                  </div>
                  <div className="pt-4 space-y-2">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Digital Signature Area</label>
                    <div className="h-24 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center group cursor-pointer hover:border-blue-500/30 transition-all">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-500 flex items-center gap-2">
                         <PenTool size={14} /> Click to Sign Securely
                       </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep('details')} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                    Back
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    Finalize & Send
                  </button>
                </div>
              </div>
            )}

            {step === 'done' && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-12 text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Prescription Sent</h4>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Authorization code #IKIKE-{Math.floor(Math.random()*90000) + 10000}</p>
                </div>
                <button onClick={onClose} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black text-xs uppercase tracking-[0.2em] transition-all">
                  Close Pad
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
