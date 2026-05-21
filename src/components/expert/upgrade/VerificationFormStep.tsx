import React from 'react';
import { FileText, Upload, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface VerificationFormStepProps {
  targetTier: string | null;
  formData: any;
  setFormData: (data: any) => void;
  isSubmitting: boolean;
  role: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const VerificationFormStep: React.FC<VerificationFormStepProps> = ({
  targetTier,
  formData,
  setFormData,
  isSubmitting,
  role,
  onSubmit
}) => {
  return (
    <motion.div
      key="form"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-3xl shadow-blue-900/5"
    >
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
          <FileText size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Verification Form</h2>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tier: {targetTier?.toUpperCase()}</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">License Number</label>
            <input 
              required
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({...formData, licenseNumber: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Primary Specialty</label>
            <input 
              required
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({...formData, specialty: e.target.value})}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
            />
          </div>
        </div>

        {targetTier === 'premium' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-8 pt-8 border-t border-slate-50 dark:border-slate-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Years of Experience</label>
                <input 
                  type="number"
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                />
              </div>
              {role === 'hospital' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Hospital Name</label>
                  <input 
                    type="text"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({...formData, hospitalName: e.target.value})}
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Clinical Biography (Max 500 words)</label>
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold resize-none"
              />
            </div>
          </motion.div>
        )}

        <div className="pt-8 border-t border-slate-50 dark:border-slate-800">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 ml-2">Clinical Evidence Upload</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-blue-500/50 transition-all">
              <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
              <span className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-white">ID / Passport</span>
              <span className="text-[8px] font-bold text-slate-400">Identity verification</span>
            </div>
            <div className="p-6 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center text-center group hover:border-blue-500/50 transition-all">
              <Upload className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors mb-4" />
              <span className="text-[10px] font-black uppercase tracking-tight text-slate-900 dark:text-white">Medical License</span>
              <span className="text-[8px] font-bold text-slate-400">MDCN / Registry Proof</span>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-all hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <>Initialize Verification <ArrowRight size={16} /></>}
        </button>
      </form>
    </motion.div>
  );
};
