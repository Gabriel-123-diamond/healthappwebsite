'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, Phone, Plus, Trash2, 
  Loader2, ShieldCheck, CheckCircle
} from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { institutionService } from '@/services/institutionService';
import { userService } from '@/services/userService';
import { verificationService } from '@/services/verificationService';

export default function InstitutionalSetupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [institutionName, setInstitutionName] = useState("Institutional Node");
  const [permitFile, setPermitFile] = useState<File | null>(null);
  const [permitUrl, setPermitUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [contactNodes, setContactNodes] = useState([
    { id: '1', label: 'Emergency Node', phone: '', email: '', available24h: true }
  ]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth/signin');
        return;
      }

      try {
        const profile = await userService.getUserProfile(user.uid);
        if (profile) {
          if (profile.institutionName) setInstitutionName(profile.institutionName);
          if ((profile as any).permitUrl) {
            setPermitUrl((profile as any).permitUrl);
          }

          if (profile.phone) {
            setContactNodes([{ 
              id: '1', 
              label: 'Main Office', 
              phone: profile.phone, 
              email: profile.email || '', 
              available24h: true 
            }]);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const user = auth.currentUser;
    if (!user) return;

    setPermitFile(file);
    setIsUploading(true);

    try {
      const url = await verificationService.uploadDocument(user.uid, file, 'hospital_permit');
      setPermitUrl(url);
      await userService.updateProfile(user.uid, {
        permitUrl: url
      } as any);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const addNode = () => {
    setContactNodes([...contactNodes, { 
      id: Date.now().toString(), 
      label: 'New Node', 
      phone: '', 
      email: '', 
      available24h: false 
    }]);
  };

  const updateNode = (id: string, field: string, val: any) => {
    setContactNodes(contactNodes.map(n => n.id === id ? { ...n, [field]: val } : n));
  };

  const removeNode = (id: string) => {
    setContactNodes(contactNodes.filter(n => n.id !== id));
  };

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      await institutionService.setupInstitution(user.uid, {
        name: institutionName,
        contactNodes,
        type: 'Hospital',
        permitUrl: permitUrl,
        verificationStatus: 'pending'
      });
      router.push('/hospital/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24">
      <div className="max-w-3xl mx-auto px-4">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[10px] font-black uppercase tracking-widest border border-indigo-200 dark:border-indigo-800/50">
            Institutional Node Activation
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {institutionName.split(' ')[0]} <span className="text-indigo-600">{institutionName.split(' ').slice(1).join(' ') || 'Onboarding.'}</span>
          </h1>
        </header>

        <div className="flex gap-2 mb-12">
          {[1, 2].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-white/10'}`} />
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[48px] border border-slate-100 dark:border-white/5 p-8 sm:p-12 shadow-xl shadow-indigo-900/5">
          {step === 1 ? (
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Facility Verification</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Upload your government-issued facility permit or operational license to verify your institutional status.
                </p>
              </div>

              <div className={`border-2 border-dashed ${permitUrl ? 'border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-500/5' : 'border-slate-200 dark:border-white/10'} rounded-[32px] p-12 text-center hover:border-indigo-500/30 transition-all group relative`}>
                <input 
                  type="file" 
                  className="hidden" 
                  id="permit-upload" 
                  onChange={handleFileChange}
                />
                <label htmlFor="permit-upload" className="cursor-pointer">
                  <div className={`w-16 h-16 ${permitUrl ? 'bg-emerald-500 text-white' : 'bg-slate-50 dark:bg-white/5 text-slate-300 dark:text-slate-700'} rounded-full flex items-center justify-center mx-auto mb-6 transition-all`}>
                    {isUploading ? <Loader2 size={32} className="animate-spin" /> : permitUrl ? <CheckCircle size={32} /> : <Upload size={32} />}
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">
                    {isUploading ? "Uploading Node Permit..." : permitFile ? permitFile.name : permitUrl ? "Permit Saved to Cloud" : "Select Permit PDF"}
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    {permitUrl ? "Click to Replace Document" : "PDF, JPG (Max 10MB)"}
                  </p>
                </label>
              </div>

              <button 
                onClick={() => setStep(2)}
                disabled={!permitUrl || isUploading}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Next Node: Configuration
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Contact Node Setup</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  Define the communication nodes for your facility. These will be visible to users in your region.
                </p>
              </div>

              <div className="space-y-6">
                {contactNodes.map((node) => (
                  <div key={node.id} className="p-6 bg-slate-50 dark:bg-white/5 rounded-3xl border border-slate-100 dark:border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
                          <Phone size={14} className="text-indigo-600" />
                        </div>
                        <input 
                          value={node.label}
                          onChange={(e) => updateNode(node.id, 'label', e.target.value)}
                          className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white focus:ring-0 outline-none w-40"
                        />
                      </div>
                      <button onClick={() => removeNode(node.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        placeholder="Phone Number"
                        value={node.phone}
                        onChange={(e) => updateNode(node.id, 'phone', e.target.value)}
                        className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                      <input 
                        placeholder="Email (Optional)"
                        value={node.email}
                        onChange={(e) => updateNode(node.id, 'email', e.target.value)}
                        className="px-5 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                      />
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div 
                        onClick={() => updateNode(node.id, 'available24h', !node.available24h)}
                        className={`w-10 h-6 rounded-full p-1 transition-all ${node.available24h ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/10'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${node.available24h ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">24/7 Availability Node</span>
                    </label>
                  </div>
                ))}

                <button 
                  onClick={addNode}
                  className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-indigo-500/30 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add Contact Node
                </button>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-5 bg-slate-100 dark:bg-white/5 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                  Authorize Institutional Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
