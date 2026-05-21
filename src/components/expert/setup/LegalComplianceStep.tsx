'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, FileCheck, Scale, PenTool, X, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LegalPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onAgree: () => void;
  onDisagree: () => void;
  isAccepted: boolean;
}

const LegalPolicyModal: React.FC<LegalPolicyModalProps> = ({ isOpen, onClose, title, content, onAgree, onDisagree, isAccepted }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            <div className="p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/20">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">{title}</h3>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            
            <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed whitespace-pre-wrap">
                  {content}
                </p>
              </div>
            </div>
            
            <div className="p-8 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row gap-4 bg-slate-50/50 dark:bg-slate-800/50">
              <button
                onClick={onDisagree}
                className="flex-1 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              >
                Disagree
              </button>
              <button
                onClick={onAgree}
                className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all flex items-center justify-center gap-2 ${
                  isAccepted 
                    ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
                    : 'bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700'
                }`}
              >
                {isAccepted ? <><CheckCircle2 size={16} /> Accepted</> : 'I Agree & Accept'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface LegalComplianceStepProps {
  formData: any;
  handleUpdate: (field: string, value: any) => void;
  validationErrors: Record<string, string>;
}

export default function LegalComplianceStep({ formData, handleUpdate, validationErrors }: LegalComplianceStepProps) {
  const [activePolicy, setActivePolicy] = useState<any>(null);

  const agreements = [
    { 
      id: 'tosAccepted', 
      label: 'Terms of Service', 
      icon: ShieldCheck,
      content: "1. OVERVIEW\nThis platform (\"Health AI\") provides a decentralized network for medical expertise. By registering as an Expert, you enter into a binding legal agreement with the platform. Your use of the service is subject to these terms and all applicable laws.\n\n2. ELIGIBILITY & REGISTRATION\nYou represent and warrant that you hold all necessary professional licenses, certifications, and insurance required to practice in your jurisdiction. You must maintain these credentials in good standing. Any suspension, revocation, or limitation of your professional license must be reported to the platform administration within 24 hours.\n\n3. PROFESSIONAL OBLIGATIONS\nAs a verified Expert, you agree to provide evidence-based, impartial medical advice. You are solely responsible for the clinical accuracy of your nodes and consultations. You agree to use the platform's secure communication protocols exclusively and strictly avoid any \"off-platform\" transactions or clinical bypasses.\n\n4. LIMITATION OF LIABILITY\nThe platform acts as a technical facilitator between experts and users. We do not practice medicine or provide clinical services directly. You maintain full professional liability for your advice, actions, and omissions. The platform shall not be liable for any indirect, incidental, or consequential damages arising from professional interactions.\n\n5. DATA OWNERSHIP & USE\nWhile you retain ownership of your professional expertise, data generated during platform interactions is subject to our data retention policies for legal and safety compliance. You may not export or use patient data for external purposes without explicit consent and platform authorization.\n\n6. TERMINATION & DECOMMISSIONING\nViolation of community standards, clinical safety protocols, or legal mandates will result in immediate decommissioning of your expert node. We reserve the right to terminate access at our sole discretion to protect the integrity of the health network."
    },
    { 
      id: 'privacyAccepted', 
      label: 'Privacy Policy', 
      icon: FileCheck,
      content: "1. DATA ENCRYPTION & SECURITY\nYour privacy and the privacy of your patients are our paramount concerns. All data transmitted through the Health AI platform is protected by military-grade AES-256 end-to-end encryption. Clinical notes and consultation records are stored in isolated, encrypted database nodes with strictly audited access controls.\n\n2. INFORMATION WE COLLECT\nWe collect information necessary for professional verification and platform security, including:\n• Professional identity and license documentation.\n• Educational background and certifications.\n• Interaction metadata and consultation history.\n• Technical device information for security auditing.\n\n3. CLINICAL DATA CONFIDENTIALITY\nPatient data shared during consultations is handled with the highest degree of medical confidentiality. We ensure full compliance with HIPAA, GDPR, and other international health data regulations. We do not share, sell, or monetize any identifiable medical or personal data to third parties for marketing purposes.\n\n4. DATA USAGE & PROCESSING\nPersonal data is processed strictly for:\n• Expert verification and authority level assignment.\n• Facilitation of secure telemedicine consultations.\n• Platform security, fraud prevention, and clinical auditing.\n• Regulatory compliance and legal record-keeping.\n\n5. YOUR DATA RIGHTS\nYou have the right to access, rectify, or request the deletion of your professional profile data. Please note that clinical records and verification logs are subject to mandatory legal retention periods and may not be immediately deletable."
    },
    { 
      id: 'telemedicineAccepted', 
      label: 'Telemedicine Guidelines', 
      icon: Scale,
      content: "1. CLINICAL STANDARDS OF CARE\nTelemedicine consultations must meet the same professional standard of care as in-person medical visits. You agree to conduct a thorough assessment based on the information available virtually. If a condition cannot be safely or accurately assessed via the platform, you have a professional obligation to refer the patient to an in-person facility immediately.\n\n2. ENVIRONMENT & PROFESSIONALISM\nConsultations must be conducted from a private, quiet, and professionally appropriate environment. You must ensure that no unauthorized persons can view your screen or hear the audio during a session. Your professional background and appearance should instill confidence and maintain the dignity of the medical profession.\n\n3. PATIENT IDENTIFICATION & CONSENT\nYou must verify the patient's identity at the start of every consultation. You are required to explain the limitations of telemedicine and obtain informed consent for virtual assessment. Clear, contemporaneous, and professional clinical records must be maintained within the platform for every patient interaction.\n\n4. EMERGENCY PROTOCOLS\nIn the event of a medical emergency during a virtual session, you must follow established emergency protocols, which include advising the patient to contact local emergency services and, where possible, assisting in the coordination of urgent care.\n\n5. TECHNOLOGY & CONNECTIVITY\nYou are responsible for ensuring a stable, high-speed, and secure internet connection. Live video nodes should be utilized whenever clinical assessment requires visual observation or physical demonstration."
    },
    { 
      id: 'conductAccepted', 
      label: 'Professional Conduct', 
      icon: ShieldCheck,
      content: "1. ETHICAL CLINICAL PRACTICE\nThe Health AI community relies on absolute trust. Experts must prioritize patient safety and well-being above all other considerations. All medical advice provided must be impartial, evidence-based, and free from any external commercial or personal influence.\n\n2. CONFLICT OF INTEREST\nYou must disclose any financial or professional interests that could be perceived as influencing your advice. The promotion of specific pharmaceutical products, medical devices, or services for direct or indirect financial gain is strictly prohibited and constitutes a breach of professional ethics.\n\n3. RESPECT & DIGNITY\nAll users of the platform must be treated with the utmost respect and dignity. We maintain a zero-tolerance policy for harassment, discrimination, or unprofessional behavior based on race, gender, religion, condition, or identity. Unprofessional conduct will result in immediate and permanent expulsion from the network.\n\n4. SECURE FINANCIAL TRANSACTIONS\nAll financial interactions, including consultation fees, expert payouts, and tips, must be processed exclusively through the platform's secure escrow and payment systems. Attempting to solicit off-platform payments or circumventing the platform's financial nodes is a violation of this Code of Conduct and may lead to account termination.\n\n5. CONTINUOUS EDUCATION\nExperts are encouraged to keep their professional knowledge current and update their profile specialties and certifications as they evolve. The platform reserves the right to re-verify credentials periodically to maintain the integrity of our authority tiers."
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    const currentLegal = formData.legal || {};
    handleUpdate('legal', { ...currentLegal, [id]: value });
    setActivePolicy(null);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Legal & Compliance</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Review and accept the legal policies to continue as a verified expert.</p>
      </div>

      <div className="space-y-4">
        {agreements.map((item) => (
          <div 
            key={item.id}
            onClick={() => setActivePolicy(item)}
            className={`p-6 rounded-[32px] border-2 transition-all cursor-pointer flex items-center justify-between group ${
              formData.legal?.[item.id] 
                ? 'bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-500/20' 
                : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-500/30 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-5">
              <div className={`p-4 rounded-2xl transition-all duration-500 ${
                formData.legal?.[item.id] ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500'
              }`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-[10px] font-black uppercase tracking-widest block mb-1 ${formData.legal?.[item.id] ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
                  Agreement Required
                </span>
                <span className={`text-lg font-black tracking-tight ${formData.legal?.[item.id] ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                  {item.label}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {formData.legal?.[item.id] && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest">
                  <CheckCircle2 size={12} /> Accepted
                </div>
              )}
              <div className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all ${
                formData.legal?.[item.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-800 group-hover:border-blue-500/30'
              }`}>
                <ChevronRight size={18} className={formData.legal?.[item.id] ? 'hidden' : ''} />
                {formData.legal?.[item.id] && <CheckCircle2 size={20} />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-2">
          <PenTool size={14} className="text-blue-500" /> Digital Signature
        </label>
        <div className="relative">
          <input 
            type="text" 
            value={formData.legal?.signature || ''}
            onChange={(e) => handleUpdate('legal', { ...formData.legal, signature: e.target.value })}
            placeholder="Type your full legal name to sign"
            className={`w-full px-6 py-5 rounded-[24px] bg-white dark:bg-slate-900 border-2 outline-none font-bold text-slate-900 dark:text-white font-mono transition-all ${
              validationErrors.signature ? 'border-red-500 ring-4 ring-red-500/10' : 'border-slate-100 dark:border-slate-800 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'
            }`}
          />
        </div>
        {validationErrors.signature && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest ml-1">{validationErrors.signature}</p>}
      </div>

      <LegalPolicyModal 
        isOpen={!!activePolicy}
        onClose={() => setActivePolicy(null)}
        title={activePolicy?.label || ''}
        content={activePolicy?.content || ''}
        isAccepted={activePolicy ? !!formData.legal?.[activePolicy.id] : false}
        onAgree={() => activePolicy && handleToggle(activePolicy.id, true)}
        onDisagree={() => activePolicy && handleToggle(activePolicy.id, false)}
      />

      {validationErrors.agreements && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400">
           <p className="text-[10px] font-black uppercase tracking-widest">{validationErrors.agreements}</p>
        </div>
      )}
    </motion.div>
  );
}
