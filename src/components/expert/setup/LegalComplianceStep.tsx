'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileCheck, Scale, PenTool } from 'lucide-react';

interface LegalComplianceStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function LegalComplianceStep({ formData, handleUpdate, validationErrors }: LegalComplianceStepProps) {
  const agreements = [
    { id: 'tosAccepted', label: 'Agreement to Terms of Service', icon: ShieldCheck },
    { id: 'privacyAccepted', label: 'Privacy Policy Agreement', icon: FileCheck },
    { id: 'telemedicineAccepted', label: 'Telemedicine Guidelines Acceptance', icon: Scale },
    { id: 'conductAccepted', label: 'Professional Conduct Policy', icon: ShieldCheck },
  ];

  const toggleAgreement = (id: string) => {
    const currentLegal = formData.legal || {};
    handleUpdate('legal', { ...currentLegal, [id]: !currentLegal[id] });
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Legal & Compliance</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Review and accept the legal policies to continue as a verified expert.</p>
      </div>

      <div className="space-y-4">
        {agreements.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleAgreement(item.id)}
            className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
              formData.legal?.[item.id] 
                ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${formData.legal?.[item.id] ? 'bg-blue-100' : 'bg-slate-100'}`}>
                <item.icon className={`w-5 h-5 ${formData.legal?.[item.id] ? 'text-blue-600' : 'text-slate-400'}`} />
              </div>
              <span className={`text-sm font-bold ${formData.legal?.[item.id] ? 'text-blue-900 dark:text-blue-100' : 'text-slate-600 dark:text-slate-400'}`}>
                {item.label}
              </span>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              formData.legal?.[item.id] ? 'bg-blue-600 border-blue-600' : 'border-slate-200'
            }`}>
              {formData.legal?.[item.id] && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Digital Signature</label>
        <div className="relative">
          <input 
            type="text" 
            value={formData.legal?.signature || ''}
            onChange={(e) => handleUpdate('legal', { ...formData.legal, signature: e.target.value })}
            placeholder="Type your full name as signature"
            className="w-full px-5 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 outline-none font-bold text-slate-900 dark:text-white font-mono"
          />
          <PenTool className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        {validationErrors.signature && <p className="text-xs text-red-500 font-bold ml-1">{validationErrors.signature}</p>}
      </div>
    </motion.div>
  );
}
