'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Shield, Stethoscope, Leaf, Users, Navigation, ChevronRight } from 'lucide-react';
import { PublicExpert } from '@/types/expert';

interface UnlockSuccessModalProps {
  showSuccessModal: boolean;
  setShowSuccessModal: (show: boolean) => void;
  privateExpert: PublicExpert | null;
}

export function UnlockSuccessModal({
  showSuccessModal,
  setShowSuccessModal,
  privateExpert
}: UnlockSuccessModalProps) {
  return (
    <AnimatePresence>
      {showSuccessModal && privateExpert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[48px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full -ml-16 -mb-16 blur-3xl" />

            <div className="relative text-center">
              <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/20 rotate-12">
                <Shield className="w-10 h-10 text-white -rotate-12" />
              </div>

              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight uppercase italic">Protocol Established</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                Private clinical entry has been decrypted and authenticated. Node access granted.
              </p>

              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 mb-10 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-700">
                    {privateExpert.type === 'doctor' ? <Stethoscope className="w-6 h-6 text-blue-600" /> : <Leaf className="w-6 h-6 text-emerald-600" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white text-lg capitalize">{privateExpert.name}</h4>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{privateExpert.specialty}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <Link
                  href={privateExpert.isMe ? "/expert/dashboard" : `/directory/${privateExpert.id}`}
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3 group"
                >
                  {privateExpert.isMe ? (
                    <>
                      <Users className="w-4 h-4" />
                      Go to Dashboard
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4" />
                      Enter Private Portal
                    </>
                  )}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-4 text-slate-400 hover:text-slate-600 font-black uppercase tracking-widest text-[10px] transition-colors"
                >
                  Close Terminal
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
