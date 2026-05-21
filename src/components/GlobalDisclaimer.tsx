'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GlobalDisclaimer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted the disclaimer
    const hasAccepted = localStorage.getItem('health_app_disclaimer_accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('health_app_disclaimer_accepted', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 dark:bg-slate-800 dark:border-slate-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
              <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                <ShieldAlert className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Global Disclaimer</h2>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="space-y-4 text-slate-600 leading-relaxed dark:text-slate-300">
                <p className="font-medium text-slate-800 text-lg dark:text-white">
                  Important Notice
                </p>
                <div className="flex gap-4 items-start">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                  <p>
                    IKIKE provides health information for educational purposes only. It does not diagnose, treat, or replace professional medical advice. Always consult a qualified healthcare professional.
                  </p>
                </div>
              </div>

              {/* Action */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAccept}
                className="w-full mt-8 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2 dark:bg-slate-700 dark:hover:bg-slate-600"
              >
                I Understand & Accept
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GlobalDisclaimer;