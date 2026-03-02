'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { 
  X, CheckCircle, XCircle, FileText, ExternalLink, 
  User, Shield, Building2, Briefcase, Calendar, MapPin, Award, DollarSign, Building
} from 'lucide-react';

interface ExpertVerificationModalProps {
  expert: UserProfile;
  onClose: () => void;
  onVerify: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function ExpertVerificationModal({ expert, onClose, onVerify, onReject }: ExpertVerificationModalProps) {
  const [rejectReason, setRejectReason] = React.useState('');
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  // We check for top-level fields first, as the new upgrade flow uses those
  const licenseNumber = expert.licenseNumber || expert.expertProfile?.license?.licenseNumber;
  const specialty = expert.specialty || expert.expertProfile?.specialty;
  const institutionName = expert.institutionName || expert.expertProfile?.practice?.hospitalName;
  const bio = expert.bio || expert.expertProfile?.bio;
  const yearsOfExperience = expert.yearsOfExperience || expert.expertProfile?.practice?.yearsExperience;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{expert.fullName}</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{expert.role} Verification Request</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Section 1: Professional Details */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Award className="w-4 h-4" /> 1. Professional Credentials
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[24px]">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialty</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{specialty || 'Not specified'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">License Number</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{licenseNumber || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                <p className="font-bold text-slate-900 dark:text-white text-lg">{yearsOfExperience} Years</p>
              </div>
              {expert.role === 'hospital' && (
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility Info</p>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{institutionName}</p>
                  {expert.expertProfile?.facilityAddress && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 transition-colors">
                      <MapPin size={12} /> {expert.expertProfile.facilityAddress}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Section 2: Bio */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <FileText className="w-4 h-4" /> 2. Professional Bio
            </h3>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-800 transition-colors">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {bio || "No professional biography provided."}
              </p>
            </div>
          </section>

          {/* Section 3: Contact Info */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Shield className="w-4 h-4" /> 3. Verified Contact
            </h3>
            <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Phone Number Verified</p>
                <p className="font-bold text-slate-900 dark:text-white">{expert.phone}</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
          {showRejectInput ? (
            <div className="space-y-3">
              <textarea 
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-4 rounded-2xl bg-white dark:bg-slate-900 border border-red-100 dark:border-red-900/30 outline-none font-medium text-sm"
                rows={3}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowRejectInput(false)} className="px-6 py-2 text-xs font-black uppercase tracking-widest text-slate-400">Cancel</button>
                <button 
                  onClick={() => onReject(expert.uid, rejectReason)}
                  disabled={!rejectReason}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowRejectInput(true)}
                className="flex items-center gap-2 px-8 py-4 bg-red-50 text-red-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all"
              >
                <XCircle className="w-4 h-4" /> Reject Application
              </button>
              <button 
                onClick={() => onVerify(expert.uid)}
                className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Approve Expert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
