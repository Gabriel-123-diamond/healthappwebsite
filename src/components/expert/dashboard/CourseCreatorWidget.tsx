'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Video, Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CourseCreatorWidget() {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[40px] p-8 text-white shadow-2xl shadow-emerald-500/20 relative overflow-hidden group">
      <div className="relative z-10 space-y-6">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
          <Video size={24} className="text-white" />
        </div>
        
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight leading-none">Creator Studio</h3>
          <p className="text-emerald-100 text-xs font-medium mt-2 leading-relaxed opacity-80">
            Design and launch holistic wellness courses, webinars, and meditation sequences for your clients.
          </p>
        </div>

        <Link 
          href="/expert/studio"
          className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-xl"
        >
          Open Studio <ArrowRight size={14} />
        </Link>
      </div>

      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute top-0 right-0 p-8 opacity-10">
         <BookOpen size={96} className="rotate-12" />
      </div>
    </div>
  );
}
