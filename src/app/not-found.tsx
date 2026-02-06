'use client';

import React from 'react';
import { Home, Search, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative w-64 h-64 mx-auto mb-12">
            <div className="absolute inset-0 bg-blue-50 rounded-[48px] rotate-12 animate-pulse" />
            <div className="absolute inset-0 bg-blue-100 rounded-[48px] -rotate-6" />
            <div className="absolute inset-0 bg-white rounded-[48px] shadow-xl border border-slate-100 flex flex-col items-center justify-center">
               <span className="text-7xl font-black text-slate-900 tracking-tighter">404</span>
               <div className="mt-2 p-3 bg-blue-50 rounded-2xl">
                 <Search className="w-8 h-8 text-blue-600" />
               </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Invalid Route
          </h1>
          <p className="text-slate-500 mb-12 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            This URL doesn't seem to belong to our platform.
          </p>

          <div className="flex flex-col items-center justify-center">
             <a 
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-[20px] font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Home className="w-5 h-5" strokeWidth={2.5} />
              Return to Safety
            </a>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
              Ikiké Health AI • Navigation Guard
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
