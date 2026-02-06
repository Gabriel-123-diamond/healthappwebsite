'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface RoleStepProps {
  formData: any;
  setFormData: (data: any) => void;
  roles: any[];
}

export default function RoleStep({ formData, setFormData, roles }: RoleStepProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 mb-2 flex items-center">
          Professional Role <span className="text-red-500 ml-2">*</span>
        </h3>
        <p className="text-slate-500 font-medium text-sm">Are you joining as a citizen seeker or a health professional?</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setFormData({...formData, role: role.id})}
            className={`flex flex-col items-start p-5 sm:p-6 rounded-2xl sm:rounded-[32px] border-2 transition-all text-left relative overflow-hidden group ${
              formData.role === role.id ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-white hover:border-blue-100'
            }`}
          >
            <div className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 transition-all duration-500 ${
              formData.role === role.id 
                ? 'bg-blue-600 text-white scale-105 sm:scale-110 shadow-lg shadow-blue-200' 
                : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500'
            }`}>
              <role.icon size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className={`font-black text-base sm:text-lg mb-1 sm:mb-1.5 ${formData.role === role.id ? 'text-blue-900' : 'text-slate-900'}`}>{role.label}</span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium leading-relaxed opacity-80">{role.desc}</span>
            
            {formData.role === role.id && (
              <div className="absolute top-4 right-4">
                <div className="p-1 bg-blue-600 rounded-full">
                  <Check className="w-3 h-3 text-white" />
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
