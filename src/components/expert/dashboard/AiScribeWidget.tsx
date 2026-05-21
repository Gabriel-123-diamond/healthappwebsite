'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mic, FileText, Wand2 } from 'lucide-react';
import { AIScribeModal } from '../AIScribeModal';

export function AiScribeWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[40px] p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest">AI Engine Active</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Clinical AI Scribe</h3>
            <p className="text-indigo-100 text-xs font-medium mt-2 leading-relaxed opacity-80">
              Transform consultation dialogue into structured SOAP notes instantly with medical-grade transcription.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button className="flex-1 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-50 transition-all shadow-xl">
              <Mic size={14} /> Start Dictation
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="absolute top-0 right-0 p-8">
           <Wand2 className="w-24 h-24 text-white/5 rotate-12" />
        </div>
      </motion.div>

      <AIScribeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        patientName="Active Consultation" 
      />
    </>
  );
}
