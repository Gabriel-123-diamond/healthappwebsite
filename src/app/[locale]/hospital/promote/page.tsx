'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, Megaphone, Globe, ShieldCheck, 
  ArrowLeft, Loader2, Sparkles, Rocket,
  Target, BarChart3, ChevronRight
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth } from '@/lib/firebase';
import { institutionService, getInstitutionById } from '@/services/institutionService';
import { Institution } from '@/types/institution';
import NiceModal from '@/components/common/NiceModal';

export default function InstitutionalPromotionPage() {
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const inst = await getInstitutionById(user.uid);
        if (inst) setInstitution(inst);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePromote = async (type: 'featured' | 'regional') => {
    if (!institution) return;
    setSaving(true);
    try {
      const config = type === 'featured' 
        ? { ...institution.promotionConfig, priority: 10 }
        : { region: 'Uyo, Akwa Ibom, NG', priority: 5, expiresAt: new Date(Date.now() + 30 * 86400000).toISOString() };      
      await institutionService.updatePromotion(institution.id, config, type === 'featured');
      
      setInstitution({
        ...institution,
        featured: type === 'featured' || institution.featured,
        promotionConfig: config as any
      });

      setModalConfig({
        isOpen: true,
        title: "Node Promoted",
        description: `Your institutional node is now prioritized in the ${type === 'featured' ? 'Global' : 'Regional'} registry.`,
        type: 'success'
      });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <header className="mb-16 space-y-4">
          <Link href="/hospital/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
            <ArrowLeft size={12} /> Institutional Console
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
              <Megaphone size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              Node <span className="text-indigo-600">Promotion.</span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl text-lg">
            Scale your clinical reach. Featured institutional nodes gain priority ranking in the global search registry.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Featured Placement */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-indigo-500/20 transition-all flex flex-col group">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center text-indigo-600 mb-8">
              <Sparkles size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Featured Placement</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">
              Appear at the very top of all institutional search results globally. Includes a verified institutional badge and boosted AI visibility.
            </p>
            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</span>
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${institution?.featured ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                  {institution?.featured ? 'Active Node' : 'Inactive'}
                </span>
              </div>
              <button 
                onClick={() => handlePromote('featured')}
                disabled={saving || institution?.featured}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
                Deploy Featured Node
              </button>
            </div>
          </div>

          {/* Regional Campaign */}
          <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:border-blue-500/20 transition-all flex flex-col group">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 mb-8">
              <Target size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">Regional Targeting</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-8 flex-1">
              Target a specific geographic radius. Priority visibility for users searching within your clinical catchment area.
            </p>
            <div className="space-y-4 pt-6 border-t border-slate-50 dark:border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active Region</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">
                  {institution?.promotionConfig?.region || 'None Configured'}
                </span>
              </div>
              <button 
                onClick={() => handlePromote('regional')}
                disabled={saving}
                className="w-full py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Globe size={14} /> Configure Region
              </button>
            </div>
          </div>
        </div>

        {/* Analytics Teaser */}
        <div className="mt-12 bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-3xl rounded-full" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-white/10 rounded-2xl">
                <BarChart3 size={32} className="text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xl font-black uppercase tracking-tight">Intelligence Metrics</h4>
                <p className="text-xs font-medium opacity-60">Featured nodes see up to 300% more patient engagement.</p>
              </div>
            </div>
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              View Conversion Nodes
            </button>
          </div>
        </div>
      </div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </div>
  );
}
