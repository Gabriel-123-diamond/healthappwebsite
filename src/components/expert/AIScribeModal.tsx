'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, FileText, Brain, Save, CheckCircle2, Wand2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { CONSULTATION_PRESETS, type ConsultationPreset } from './aiScribePresets';

interface AIScribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
}

export function AIScribeModal({ isOpen, onClose, patientName }: AIScribeModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'idle' | 'transcribing' | 'analyzing' | 'done'>('idle');
  const [notes, setNotes] = useState('');

  const [transcriptChunks, setTranscriptChunks] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const handlePresetSelect = (preset: ConsultationPreset) => {
    setTranscriptChunks(preset.transcript);
    generateNotes(preset.transcript);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Microphone dictate relies on the Web Speech API. Please use a modern Chrome/Safari browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          const text = event.results[i][0].transcript.trim();
          if (text) {
            setTranscriptChunks(prev => [...prev, text]);
          }
        }
      }
    };

    recognition.onerror = (e: any) => console.error("Speech Error:", e);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const generateNotes = async (forcedTranscript?: string[]) => {
    setIsProcessing(true);
    setStep('transcribing');
    
    // Simulate initial transcription parsing lag for UX
    await new Promise(res => setTimeout(res, 1000));
    setStep('analyzing');
    
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Authentication required");
      
      const token = await user.getIdToken();
      const currentTranscript = forcedTranscript || (transcriptChunks.length > 0 ? transcriptChunks : ["No dictation captured."]);
      
      const response = await fetch('/api/expert/scribe/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          transcript: currentTranscript,
          patientName: patientName,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI notes');
      }

      const data = await response.json();
      setNotes(data.notes);
      setStep('done');
    } catch (error) {
      console.error(error);
      alert("AI Scribe encountered an error. Please try again.");
      setStep('idle');
    } finally {
      setIsProcessing(false);
    }
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
              <div className="space-y-8">
                {/* Preset Cases */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Simulate Consultation</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {CONSULTATION_PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl text-left hover:border-indigo-500/30 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-all group"
                      >
                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{preset.label}</p>
                        <p className="text-[8px] text-slate-500 mt-1 font-bold">Auto-generate SOAP</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                   <div className="absolute inset-x-0 top-1/2 h-px bg-slate-100 dark:bg-slate-800" />
                   <div className="relative flex justify-center">
                      <span className="px-4 bg-white dark:bg-slate-900 text-[8px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[32px] border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Document Dictation</h4>
                    <button 
                      onClick={toggleListening}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${isListening ? 'bg-red-500 text-white shadow-red-500/20 animate-pulse' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'}`}
                    >
                      {isListening ? (
                         <>
                           <div className="w-2 h-2 rounded-full bg-white animate-ping" />
                           Recording...
                         </>
                      ) : (
                         "Start Microphone"
                      )}
                    </button>
                  </div>
                  <div className="space-y-3 min-h-[100px] max-h-[200px] overflow-y-auto">
                    {transcriptChunks.length === 0 ? (
                      <p className="text-sm font-bold text-slate-400 italic text-center py-4 opacity-50">
                        {isListening ? "Listening intently to your voice..." : "Microphone inactive. Tap 'Start Microphone' to dictation."}
                      </p>
                    ) : (
                      transcriptChunks.map((line, i) => (
                        <p key={i} className="text-sm font-medium text-slate-600 dark:text-slate-300 flex gap-3">
                          <span className="text-indigo-500 font-black">[{i+1}]</span> {line}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                <button
                  onClick={() => generateNotes()}
                  className="w-full py-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-indigo-500/10"
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
