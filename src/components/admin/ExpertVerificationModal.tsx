'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { 
  X, CheckCircle, XCircle, FileText, 
  User, Shield, Building2, Briefcase, Award, Building, Mail
} from 'lucide-react';
import { DocLink, InfoItem } from './ExpertVerificationComponents';

interface ExpertVerificationModalProps {
  expert: UserProfile;
  onClose: () => void;
  onVerify: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export default function ExpertVerificationModal({ expert, onClose, onVerify, onReject }: ExpertVerificationModalProps) {
  const [rejectReason, setRejectReason] = React.useState('');
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  const profile = expert.expertProfile;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[95vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <User className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{expert.fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {expert.role}
                </span>
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {expert.uid}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12">
          
          {/* Section 1: Basic Information */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                <User className="w-4 h-4" /> 1. Basic Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-slate-50 dark:bg-slate-800/30 p-8 rounded-[32px]">
              <InfoItem label="Date of Birth" value={profile?.kyc?.dob || expert.dateOfBirth} />
              <InfoItem label="Email" value={expert.email} />
              <InfoItem label="Phone" value={expert.phone} />
              <div className="md:col-span-3">
                <InfoItem label="Residential Address" value={profile?.kyc?.address} />
              </div>
            </div>
          </section>

          {/* Section 2: Identity (KYC) */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-600 flex items-center gap-2">
                <Shield className="w-4 h-4" /> 2. Identity Verification (KYC)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-emerald-50/30 dark:bg-emerald-500/5 p-8 rounded-[32px] border border-emerald-100 dark:border-emerald-500/10">
              <InfoItem label="ID Number" value={profile?.kyc?.idNumber} />
              <div className="flex flex-wrap gap-3 mt-4">
                <DocLink url={profile?.kyc?.idCardUrl} label="ID Card" />
                <DocLink url={profile?.kyc?.selfieUrl} label="Selfie" />
                <DocLink url={profile?.kyc?.passportPhotoUrl} label="Passport Photo" />
              </div>
            </div>
          </section>

          {/* Section 3: Medical License */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                <Award className="w-4 h-4" /> 3. Medical License
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-blue-50/30 dark:bg-blue-600/5 p-8 rounded-[32px] border border-blue-100 dark:border-blue-600/10">
              <InfoItem label="License Number" value={profile?.license?.licenseNumber || expert.licenseNumber} />
              <InfoItem label="Issuance Year" value={profile?.license?.issuanceYear} />
              <InfoItem label="Expiry Date" value={profile?.license?.expiryDate} />
              <div className="md:col-span-3 flex flex-wrap gap-3 mt-2">
                <DocLink url={profile?.license?.licenseCertUrl} label="License Certificate" />
                <DocLink url={profile?.license?.annualLicenseUrl} label="Annual Practicing License" />
              </div>
            </div>
          </section>

          {/* Section 4: Education */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4" /> 4. Education & Qualifications
              </h3>
            </div>
            <div className="space-y-4">
              {profile?.education && profile.education.length > 0 ? (
                profile.education.map((edu, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800 gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
                      <InfoItem label="Degree" value={edu.degree} />
                      <InfoItem label="Institution" value={edu.institution} />
                      <InfoItem label="Year" value={edu.year} />
                    </div>
                    <DocLink url={edu.certUrl} label="Certificate" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No education records provided</p>
                </div>
              )}
            </div>
          </section>

          {/* Section 5: Practice & Profile */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-orange-600 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> 5. Practice Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-orange-50/30 dark:bg-orange-600/5 p-8 rounded-[32px] border border-orange-100 dark:border-orange-600/10">
              <InfoItem label="Hospital/Facility" value={profile?.practice?.hospitalName || expert.institutionName} />
              <InfoItem label="Experience" value={profile?.practice?.yearsExperience || expert.yearsOfExperience} subValue="Years" />
              <div className="md:col-span-2">
                <InfoItem label="Facility Address" value={profile?.practice?.hospitalAddress || profile?.facilityAddress} />
              </div>
              <InfoItem label="Consultation Type" value={profile?.practice?.consultationType} />
              <div className="flex items-center gap-3">
                <DocLink url={profile?.practice?.hospitalIdUrl} label="Hospital ID Card" />
              </div>
            </div>
          </section>

          {/* Section 6: Professional Bio */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
                <FileText className="w-4 h-4" /> 6. Professional Bio
              </h3>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-800/30 rounded-[32px] border border-slate-100 dark:border-slate-800">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {profile?.bio || expert.bio || "No professional biography provided."}
              </p>
            </div>
          </section>

          {/* Section 7: Legal & Signature */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-4 h-4" /> 7. Legal Compliance
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-900 dark:bg-black p-8 rounded-[32px] text-white">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Digital Signature</p>
                <p className="font-black text-2xl tracking-tight font-serif italic text-blue-400">
                  {profile?.legal?.signature || 'Unsigned'}
                </p>
              </div>
              <InfoItem label="Signed Timestamp" value={profile?.legal?.timestamp ? new Date(profile.legal.timestamp).toLocaleString() : 'N/A'} />
            </div>
          </section>

        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-4">
          {showRejectInput ? (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs font-black text-red-500 uppercase tracking-widest ml-1">Provide a reason for rejection</p>
              <textarea 
                placeholder="The submitted license is expired / The ID card is not clear..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-6 rounded-[24px] bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/30 outline-none font-bold text-sm focus:border-red-500 transition-all"
                rows={3}
              />
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowRejectInput(false)} className="px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                <button 
                  onClick={() => onReject(expert.uid, rejectReason)}
                  disabled={!rejectReason}
                  className="px-10 py-4 bg-red-600 text-white rounded-[20px] text-xs font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => setShowRejectInput(true)}
                className="flex items-center gap-3 px-10 py-5 bg-white dark:bg-slate-900 border-2 border-red-100 dark:border-red-900/20 text-red-600 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
              >
                <XCircle className="w-5 h-5" /> Reject Application
              </button>
              <button 
                onClick={() => onVerify(expert.uid)}
                className="flex items-center gap-3 px-12 py-5 bg-blue-600 text-white rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-2xl shadow-blue-500/30 active:scale-95 transition-all"
              >
                <CheckCircle className="w-5 h-5" /> Approve Expert
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
