'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Briefcase, Award, Save, ArrowLeft, 
  Loader2, Plus, Trash2, ShieldCheck, BookOpen, 
  ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { expertService } from '@/services/expertService';
import { Expert, PortfolioItem } from '@/types/expert';

export default function ExpertProfileEditorPage() {
  const [expert, setExpert] = useState<Expert | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Form State
  const [bio, setBio] = useState('');
  const [clinicalHistory, setClinicalHistory] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const data = await userService.getUserProfile(user.uid);
        if (data?.expertProfile) {
          setExpert(data.expertProfile);
          setBio(data.expertProfile.bio || '');
          setClinicalHistory(data.expertProfile.clinicalHistory || '');
          setExpertise(data.expertProfile.expertise || []);
          setPortfolio(data.expertProfile.portfolio || []);
        }
      } catch (error) {
        console.error("Failed to fetch expert profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    if (!expert) return;
    setSaving(true);
    try {
      await expertService.updateProfessionalProfile(expert.id, {
        bio,
        clinicalHistory,
        expertise,
        portfolio,
        updatedAt: new Date().toISOString()
      });
      router.push('/expert/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const addExpertise = () => {
    if (newTag.trim() && !expertise.includes(newTag.trim())) {
      setExpertise([...expertise, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeExpertise = (tag: string) => {
    setExpertise(expertise.filter(t => t !== tag));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24">
      <div className="max-w-5xl mx-auto px-4">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link href="/expert/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
              <ArrowLeft size={12} /> Expert Console
            </Link>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Professional <span className="text-blue-600">Profile.</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Manage your clinical identity and evidence-based portfolio nodes.
            </p>
          </div>

          <button 
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Deploy Updates
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-12">
            {/* Bio & History */}
            <section className="space-y-8 bg-white dark:bg-slate-900 p-10 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Professional Bio</label>
                <textarea 
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full p-6 bg-slate-50 dark:bg-white/5 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none border-none resize-none"
                  rows={4}
                  placeholder="Brief professional introduction..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Clinical & Historical Context</label>
                <textarea 
                  value={clinicalHistory}
                  onChange={e => setClinicalHistory(e.target.value)}
                  className="w-full p-6 bg-slate-50 dark:bg-white/5 rounded-3xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none border-none resize-none"
                  rows={8}
                  placeholder="Detailed clinical background, methodologies, and lineage (for wellness practitioners)..."
                />
              </div>
            </section>

            {/* Portfolio Section */}
            <section className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  Evidence Portfolio <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px]">{portfolio.length}</span>
                </h3>
                <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">+ Add Case Study</button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {portfolio.length === 0 ? (
                  <div className="p-12 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[40px] text-center text-slate-400 font-bold text-xs">
                    No clinical evidence nodes added yet.
                  </div>
                ) : (
                  portfolio.map((item, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-6">
                      <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-300">
                        <ImageIcon size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase">{item.title}</h4>
                        <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{item.description}</p>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Expertise Tags */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Clinical Specialties</h3>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {expertise.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 text-[10px] font-black uppercase rounded-lg border border-blue-100 dark:border-blue-500/20">
                    {tag}
                    <button onClick={() => removeExpertise(tag)} className="hover:text-red-500"><Plus size={10} className="rotate-45" /></button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input 
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && addExpertise()}
                  placeholder="Add specialty..."
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-white/5 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <button 
                  onClick={addExpertise}
                  className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* Quality Node */}
            <div className="bg-slate-900 p-8 rounded-[40px] text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 blur-2xl rounded-full" />
              <ShieldCheck size={24} className="text-blue-400 mb-4" />
              <h4 className="text-sm font-black uppercase tracking-tight mb-2">Verification Standard</h4>
              <p className="text-[10px] font-medium opacity-60 leading-relaxed">
                High-quality clinical history and evidence-based portfolios increase your search visibility node by up to 40%.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
