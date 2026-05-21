'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Clock, AlertTriangle } from 'lucide-react';

export default function AutoLockController() {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  const logout = useCallback(() => {
    if (auth.currentUser) {
      auth.signOut();
      router.push('/auth/signin');
    }
  }, [router]);

  const resetTimer = useCallback(() => {
    // If no user is logged in, don't start/reset the timer
    if (!auth.currentUser) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      setShowWarning(false);
      setTimeLeft(null);
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    
    setShowWarning(false);
    setTimeLeft(null);

    const minutes = parseInt(localStorage.getItem('autoLogoutTimerMinutes') || '15', 10);
    const ms = minutes * 60 * 1000;

    // Set the main logout timer
    timerRef.current = setTimeout(logout, ms);

    // Set the warning countdown (starts 60 seconds before logout, or half-way if timer is very short)
    const warningThreshold = Math.min(60 * 1000, ms / 2);
    
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true);
      const remaining = Math.floor(warningThreshold / 1000);
      setTimeLeft(remaining);
      
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev !== null && prev <= 1) {
            clearInterval(countdownRef.current!);
            return 0;
          }
          return prev !== null ? prev - 1 : null;
        });
      }, 1000);
    }, ms - warningThreshold);

  }, [logout]);

  useEffect(() => {
    // Activities to track
    const events = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
    
    const handleActivity = () => {
      // Only reset if we are not already in a critical warning state or 
      // if the user deliberately interacts while warning is shown
      resetTimer();
    };

    events.forEach(event => window.addEventListener(event, handleActivity));
    
    // Listen for storage changes from ProfileMenu
    window.addEventListener('storage', resetTimer);

    // Watch for auth changes to start/stop the timer
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      resetTimer();
    });

    resetTimer(); // Initial start

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      events.forEach(event => window.removeEventListener(event, handleActivity));
      window.removeEventListener('storage', resetTimer);
      unsubscribeAuth();
    };
  }, [resetTimer]);

  return (
    <AnimatePresence>
      {showWarning && timeLeft !== null && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full"
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 overflow-hidden relative">
            {/* Progress Bar background */}
            <div className="absolute bottom-0 left-0 h-1 bg-blue-600/10 w-full" />
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-blue-600"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: timeLeft, ease: "linear" }}
            />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Shield className="text-amber-500 w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1">
                  Security Timeout
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                  Due to inactivity, your session will be terminated in <span className="text-blue-600 font-bold">{timeLeft}s</span> for HIPAA compliance.
                </p>
                <button
                  onClick={resetTimer}
                  className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Clock size={14} />
                  Stay Connected
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
