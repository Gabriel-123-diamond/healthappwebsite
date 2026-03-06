'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/routing';
import { paymentService } from '@/services/paymentService';
import { Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState('');

  const sessionId = searchParams.get('session_id');
  const tier = searchParams.get('tier');

  useEffect(() => {
    if (!sessionId) {
      router.push('/onboarding');
      return;
    }

    const verify = async () => {
      try {
        const result = await paymentService.verifyPayment(sessionId);
        if (result.success) {
          // Success! Wait a moment to show the animation then redirect
          setTimeout(() => {
            router.push('/onboarding');
          }, 3000);
        } else {
          setError(result.error || 'Verification failed');
        }
      } catch (err) {
        setError('Error connecting to verification server');
      } finally {
        setVerifying(false);
      }
    };

    verify();
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center pt-32 sm:pt-40">
      <div className="max-w-md w-full bg-white dark:bg-[#0B1221] rounded-[48px] p-12 shadow-2xl border border-slate-100 dark:border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            {verifying ? (
              <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
            ) : error ? (
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-red-500" />
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20"
              >
                <ShieldCheck size={40} strokeWidth={2.5} />
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {verifying ? 'Securing Node...' : error ? 'Access Denied' : 'Hub Activated'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {verifying 
                ? 'Verifying your clinical credentials and network authorization...' 
                : error 
                ? `Protocol Error: ${error}` 
                : `Welcome to the ${tier?.toUpperCase()} tier. Your intelligence hub is now initialized.`}
            </p>
          </div>

          {!verifying && !error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Redirecting to Control Panel
              </div>
            </motion.div>
          )}

          {error && (
            <button 
              onClick={() => router.push('/onboarding')}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Return to Setup
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
