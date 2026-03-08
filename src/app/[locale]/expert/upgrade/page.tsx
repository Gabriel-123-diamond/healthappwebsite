'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '@/services/userService';
import { 
  ShieldCheck, 
  Stethoscope, 
  Building2, 
  Leaf, 
  ArrowRight, 
  CheckCircle2, 
  Loader2,
  ChevronLeft,
  Award,
  Sparkles,
  Zap,
  MapPin,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '@/types';
import NiceModal from '@/components/common/NiceModal';

export default function ExpertUpgradePage() {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsLoading] = useState(false);
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const [formData, setFormData] = useState({
    role: 'doctor' as UserRole,
    specialty: '',
    licenseNumber: '',
    institutionName: '',
    facilityAddress: '',
    facilityType: 'Clinic',
    bio: '',
    experience: '1',
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin');
      } else {
        setUser(currentUser);
        const profile = await userService.getUserProfile(currentUser.uid);
        if (profile) {
          setUserProfile(profile);
          // Pre-fill if they started but didn't finish
          setFormData(prev => ({
            ...prev,
            role: (profile.role as UserRole) || 'doctor',
            specialty: profile.specialty || '',
            licenseNumber: profile.licenseNumber || '',
            institutionName: profile.institutionName || '',
            bio: profile.bio || '',
            experience: profile.yearsOfExperience || '1',
          }));

          if (profile.verificationStatus === 'pending') {
            setStep(3);
          } else if (profile.verificationStatus === 'verified') {
            setStep(4);
          }
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleNext = async () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setIsLoading(true);
      try {
        const expertProfile: any = {
          type: formData.role,
          specialty: formData.specialty,
          yearsOfExperience: formData.experience,
          bio: formData.bio,
        };

        if (formData.role === 'hospital') {
          expertProfile.facilityAddress = formData.facilityAddress;
          expertProfile.facilityType = formData.facilityType;
          expertProfile.institutionName = formData.institutionName;
        }

        await userService.submitExpertProfile({
          expertProfile,
          bio: formData.bio,
          specialties: [{ name: formData.specialty, years: formData.experience }],
          specialty: formData.specialty,
          yearsOfExperience: formData.experience,
          licenseNumber: formData.licenseNumber
        });
        
        setStep(3);
      } catch (error) {
        console.error(error);
        showAlert('Submission Failed', 'Failed to submit application', 'warning');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpgradeTier = async (newTier: 'basic' | 'professional' | 'standard' | 'premium') => {
    setIsLoading(true);
    try {
      await userService.upgradeTier(newTier);
      showAlert('Upgrade Successful', `Successfully upgraded to ${newTier.toUpperCase()}!`, 'success');
      setTimeout(() => router.push('/expert/dashboard'), 2000);
    } catch (error) {
      showAlert('Upgrade Failed', 'Failed to upgrade tier', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const expertTypes = [
    { id: 'doctor', title: 'Medical Doctor', icon: Stethoscope, desc: 'Licensed MDs, Specialists, and Surgeons' },
    { id: 'hospital', title: 'Healthcare Facility', icon: Building2, desc: 'Clinics, Hospitals, and Diagnostic Centers' },
    { id: 'herbal_practitioner', title: 'Traditional Expert', icon: Leaf, desc: 'Herbal Medicine and Natural Health Practitioners' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-20 px-4 transition-colors">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-12">
          <button 
            onClick={() => step === 1 ? router.push('/profile') : setStep(step - 1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:white transition-colors uppercase font-black text-[10px] tracking-widest mb-8"
          >
            <ChevronLeft size={14} />
            {step === 1 ? 'Back to Profile' : 'Previous Step'}
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20 text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Professional Upgrade</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {step <= 2 ? `Step ${step} of 2: Application` : step === 3 ? 'Review Phase' : 'Subscription Tier'}
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Choose Your Professional Identity</h2>
              <div className="grid grid-cols-1 gap-4">
                {expertTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setFormData({ ...formData, role: type.id as UserRole })}
                    className={`flex items-center gap-6 p-6 rounded-3xl border-2 transition-all text-left group ${
                      formData.role === type.id 
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/10' 
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-200'
                    }`}
                  >
                    <div className={`p-4 rounded-2xl transition-all ${
                      formData.role === type.id ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600'
                    }`}>
                      <type.icon size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-lg">{type.title}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{type.desc}</p>
                    </div>
                    {formData.role === type.id && (
                      <div className="ml-auto">
                        <CheckCircle2 className="text-blue-600" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleNext}
                className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-transform hover:scale-[1.02] active:scale-95"
              >
                Continue to Verification <ArrowRight size={16} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
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
                onClick={handleNext}
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-2xl transition-all hover:bg-blue-700 disabled:bg-slate-200"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <>Submit for Admin Review <ShieldCheck size={16} /></>}
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-12"
            >
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 mb-6">
                  <Loader2 size={48} className="animate-spin" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-slate-50 dark:border-slate-950"
                >
                  <ShieldCheck size={14} />
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Application Pending</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto font-medium">
                  IKIKE Admin is currently reviewing your professional credentials. You will be notified once your 'Verified Expert' badge is awarded.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-3xl border border-amber-100 dark:border-amber-900/20 max-w-sm mx-auto">
                <p className="text-amber-700 dark:text-amber-400 text-xs font-bold leading-relaxed">
                  Verification usually takes 24-48 hours. Please ensure your license number is accurate to avoid delays.
                </p>
              </div>

              <button 
                onClick={() => router.push('/profile')}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-black uppercase tracking-widest text-[10px] transition-colors"
              >
                Return to My Profile
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  <Award size={12} /> Verified Specialist
                </div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Choose Your Tier</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Unlock priority placement and consultation features</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Professional Tier */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-blue-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 border-slate-100 dark:border-slate-800 hover:border-blue-600 transition-all flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                        <Sparkles size={32} />
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Monthly</span>
                        <span className="text-3xl font-black text-slate-900 dark:text-white">$20</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">Professional</h3>
                    <ul className="space-y-4 flex-1">
                      {['Verified Badge', 'Priority Directory Listing', 'Patient Inquiries', 'Profile Analytics'].map((feat) => (
                        <li key={feat} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {feat}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handleUpgradeTier('professional')}
                      disabled={isSubmitting}
                      className="mt-8 w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Upgrade to Professional'}
                    </button>
                  </div>
                </div>

                {/* Premium Tier */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-indigo-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity" />
                  <div className="relative bg-slate-900 dark:bg-white p-8 rounded-[40px] border-2 border-slate-800 dark:border-slate-100 hover:border-indigo-600 transition-all flex flex-col h-full text-white dark:text-slate-900">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full">
                      Maximum Exposure
                    </div>
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-100 text-indigo-400">
                        <Zap size={32} />
                      </div>
                      <div className="text-right">
                        <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Monthly</span>
                        <span className="text-3xl font-black">$100</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tight">Premium</h3>
                    <ul className="space-y-4 flex-1">
                      {['All Professional Features', 'Featured Home Placement', 'Video Consultations', 'Appointment Booking'].map((feat) => (
                        <li key={feat} className="flex items-center gap-3 text-sm font-bold opacity-80">
                          <CheckCircle2 size={16} className="text-indigo-400 shrink-0" /> {feat}
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => handleUpgradeTier('premium')}
                      disabled={isSubmitting}
                      className="mt-8 w-full py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-white/10 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Unlock Premium Access'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <NiceModal
          isOpen={modalConfig.isOpen}
          onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
          title={modalConfig.title}
          description={modalConfig.description}
          type={modalConfig.type}
        />
      </div>
    </div>
  );
}
