'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, ShieldCheck } from 'lucide-react';

interface RoleStepProps {
  formData: any;
  setFormData: (data: any) => void;
  roles: any[];
}

export default function RoleStep({ formData, setFormData, roles }: RoleStepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 sm:space-y-10">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
          Step 3: Professional Identity
        </div>
        <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
          Select Your Profile <br className="hidden sm:block" />
          <span className="text-blue-600">Categorization</span>
        </h3>
        <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-lg">
          Choose how you will engage with the health intelligence community.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setFormData({...formData, role: role.id})}
            className={`flex flex-col items-start p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border-2 transition-all duration-500 text-left relative overflow-hidden group ${
              formData.role === role.id 
                ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/20 shadow-2xl shadow-blue-500/10' 
                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'
            }`}
          >
            <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl mb-6 sm:mb-8 flex items-center justify-center transition-all duration-500 ${
              formData.role === role.id 
                ? 'bg-blue-600 text-white scale-110 shadow-xl shadow-blue-600/30 rotate-3' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500'
            }`}>
              <role.icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2.5} />
            </div>

            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2">
                <span className={`block font-black text-xl sm:text-2xl tracking-tight ${formData.role === role.id ? 'text-blue-900 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                  {role.label}
                </span>
                {['doctor', 'herbal_practitioner', 'hospital'].includes(role.id) && (
                  <ShieldCheck size={16} className="text-blue-500 opacity-50" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
                {role.desc}
              </p>
            </div>

            {/* Interactive Footer */}
            <div className={`mt-6 sm:mt-8 flex items-center gap-2 font-black uppercase tracking-widest text-[9px] sm:text-[10px] transition-all duration-500 ${
              formData.role === role.id ? 'text-blue-600' : 'text-slate-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-2'
            }`}>
              {formData.role === role.id ? (
                <>
                  <div className="p-1 bg-blue-600 rounded-full text-white">
                    <Check size={10} strokeWidth={4} />
                  </div>
                  Selected Identity
                </>
              ) : (
                <>
                  Choose role <ArrowRight size={12} strokeWidth={3} />
                </>
              )}
            </div>

            {/* Visual Flare */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-600/10 to-transparent blur-3xl transition-opacity duration-500 ${formData.role === role.id ? 'opacity-100' : 'opacity-0'}`} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
