'use client';

import React from 'react';
import { UserProfile } from '@/types';
import { 
  X, CheckCircle, XCircle, FileText, ExternalLink, 
  User, Shield, Building2, Briefcase, Calendar, MapPin, Award, DollarSign
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

  const ep = expert.expertProfile;

  if (!ep) return null;

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
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{ep.type} Verification Request</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Section 1: Identity (KYC) */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <Shield className="w-4 h-4" /> 1. Identity Verification (KYC)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p>
                <p className="font-bold text-slate-900 dark:text-white">{ep.kyc.dob}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Residential Address</p>
                <p className="font-bold text-slate-900 dark:text-white">{ep.kyc.address}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <DocPreview label="ID Card" url={ep.kyc.idCardUrl} />
              <DocPreview label="Selfie with ID" url={ep.kyc.selfieUrl} />
              <DocPreview label="Passport Photo" url={ep.kyc.passportPhotoUrl} />
            </div>
          </section>

          {/* Section 2: Medical License */}
          <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <FileText className="w-4 h-4" /> 2. Medical License Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">License Number</p>
                <p className="font-bold text-slate-900 dark:text-white">{ep.license.licenseNumber}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Areas of Expertise</p>
                <div className="flex flex-wrap gap-2">
                  {ep.expertise.map((exp, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold uppercase">{exp}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-[10px] font-black uppercase">{ep.license.practicingStatus}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <DocPreview label="MDCN License Certificate" url={ep.license.licenseCertUrl} />
              <DocPreview label="Annual Practicing License" url={ep.license.annualLicenseUrl} />
            </div>
          </section>

          {/* Section 3: Education & Practice */}
          <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
              <GraduationCapIcon className="w-4 h-4" /> 3. Education & Practice
            </h3>
            <div className="space-y-6">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Education</p>
                  <div className="space-y-2">
                    {ep.education.map((edu, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{edu.degree}</p>
                          <p className="text-xs text-slate-500">{edu.institution} ({edu.year})</p>
                        </div>
                        {edu.certUrl && (
                          <a href={edu.certUrl} target="_blank" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
               </div>
               
               <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Practice</p>
                    <p className="font-bold text-slate-900 dark:text-white">{ep.practice.hospitalName}</p>
                    <p className="text-xs text-slate-500">{ep.practice.hospitalAddress}</p>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                    <p className="font-bold text-slate-900 dark:text-white">{ep.practice.yearsExperience} Years</p>
                    <p className="text-xs text-slate-500">Consultation: {ep.practice.consultationType}</p>
                 </div>
               </div>
            </div>
          </section>

          {/* Section 4: Legal */}
          <section className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
             <h3 className="text-xs font-black uppercase tracking-widest text-blue-600 flex items-center gap-2">
               <Shield className="w-4 h-4" /> 4. Legal & Compliance
             </h3>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Digital Signature</p>
                   <p className="font-mono font-bold text-slate-900 dark:text-white text-lg">{ep.legal.signature}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                   {ep.legal.tosAccepted && <LegalBadge label="TOS" />}
                   {ep.legal.privacyAccepted && <LegalBadge label="Privacy" />}
                   {ep.legal.telemedicineAccepted && <LegalBadge label="Telemedicine" />}
                   {ep.legal.conductAccepted && <LegalBadge label="Conduct" />}
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

function DocPreview({ label, url }: { label: string, url: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <a 
        href={url} 
        target="_blank" 
        className="block aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2 hover:bg-slate-200 transition-all group"
      >
        <FileText className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors" />
        <span className="text-[10px] font-black uppercase text-slate-400 group-hover:text-blue-600">View Document</span>
      </a>
    </div>
  );
}

function LegalBadge({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-200 dark:border-blue-800">
      {label} Accepted
    </span>
  );
}

function GraduationCapIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
