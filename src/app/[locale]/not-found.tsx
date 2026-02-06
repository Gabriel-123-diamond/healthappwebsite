'use client';

import React, { useEffect, useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import { Home, ArrowLeft, Search, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  const [countdown, setCountdown] = useState(10);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Visual Indicator */}
          <div className="relative w-64 h-64 mx-auto mb-12">
            <div className="absolute inset-0 bg-blue-50 dark:bg-blue-900/20 rounded-[48px] rotate-12 animate-pulse" />
            <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/40 rounded-[48px] -rotate-6 transition-transform hover:rotate-0 duration-700" />
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-[48px] shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center">
               <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">404</span>
               <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
                 <Search className="w-8 h-8 text-blue-600 dark:text-blue-400" />
               </div>
            </div>
            
            {/* Floating Badges */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg"
            >
              <ShieldAlert className="w-6 h-6" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            Lost in discovery?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
            The page you're looking for seems to have vanished into the herbal mist. 
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-2xl p-4 mb-12 flex items-center justify-center gap-3 max-w-sm mx-auto">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-bounce" />
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
              Auto-redirecting to Home in <span className="text-lg tabular-nums">{countdown}</span>s
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Link 
              href="/"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-[20px] font-black text-lg hover:bg-blue-700 hover:scale-[1.02] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
            >
              <Home className="w-5 h-5" strokeWidth={2.5} />
              Redirect to Home Now
            </Link>
            
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-10 py-4 rounded-[20px] font-black text-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
              Go Back
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
            <p className="text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-[0.2em]">
              Ikiké Health AI • Navigation System
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
