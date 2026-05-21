'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';
import { UserRole } from '@/types';

interface ExpertApplicationFormProps {
  formData: {
    role: UserRole;
    specialty: string;
    licenseNumber: string;
    institutionName: string;
    facilityAddress: string;
    facilityType: string;
    bio: string;
  };
  setFormData: (data: any) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const ExpertApplicationForm: React.FC<ExpertApplicationFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  isSubmitting 
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[40px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800 space-y-8"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Area of Specialty</label>
            <input 
              type="text"
              placeholder="e.g. Cardiology"
              value={formData.specialty}
              onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">License Number</label>
            <input 
              type="text"
              placeholder={formData.role === 'hospital' ? "HOSP-12345" : "MD-12345678"}
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        {formData.role === 'hospital' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Hospital Name</label>
              <input 
                type="text"
                placeholder="City General Hospital"
                value={formData.institutionName}
                onChange={(e) => setFormData({...formData, institutionName: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Facility Type</label>
              <select 
                value={formData.facilityType}
                onChange={(e) => setFormData({...formData, facilityType: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold appearance-none"
              >
                <option>Clinic</option>
                <option>Hospital</option>
                <option>Diagnostic Center</option>
                <option>Pharmacy</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Facility Registered Address</label>
              <input 
                type="text"
                placeholder="Full Physical Address of the Facility"
                value={formData.facilityAddress}
                onChange={(e) => setFormData({...formData, facilityAddress: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Professional Bio</label>
          <textarea 
            rows={4}
            placeholder="Tell us about your medical background..."
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold resize-none"
          />
        </div>
      </div>

      <button 
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-all hover:bg-blue-700 disabled:bg-slate-200"
      >
        {isSubmitting ? <Loader2 className="animate-spin" /> : <>Submit for Admin Review <ShieldCheck size={16} /></>}
      </button>
    </motion.div>
  );
};
