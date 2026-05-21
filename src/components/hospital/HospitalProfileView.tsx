'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Search, Clock, FileDown, MapPin, Users, Activity, Globe, Info } from 'lucide-react';
import { PublicExpert } from '@/types/expert';

interface HospitalProfileViewProps {
  hospital: PublicExpert;
}

export default function HospitalProfileView({ hospital }: HospitalProfileViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'directory' | 'resources'>('overview');

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1587350859723-938e127633d6?auto=format&fit=crop&q=80&w=800', label: 'Main Entrance' },
    { url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800', label: 'Emergency Ward' },
    { url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800', label: 'Diagnostic Center' },
  ];

  const departments = [
    { name: 'Cardiology', doctors: 8, waitTime: '15m' },
    { name: 'Neurology', doctors: 5, waitTime: '45m' },
    { name: 'Pediatrics', doctors: 12, waitTime: '10m' },
    { name: 'General Surgery', doctors: 6, waitTime: '1h' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16">
      {/* Header Info Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ER Wait Time</p>
            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">12 Minutes</p>
          </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Staff</p>
            <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">84 Experts</p>
          </div>
        </div>
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Globe size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
            <p className="text-xl font-black text-emerald-600 uppercase tracking-tight">Operational</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 dark:border-white/5 gap-8">
        {(['overview', 'directory', 'resources'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab}
            {activeTab === tab && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full" />}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            {/* Bio */}
            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <Info className="text-blue-600" size={20} />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase tracking-widest text-sm">Facility Overview</h2>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-4xl">
                {hospital.bio || `${hospital.name} is a premier healthcare institution providing comprehensive medical services. Our facility is equipped with state-of-the-art diagnostic and treatment technology, managed by a team of world-class specialists.`}
              </p>
            </section>

            {/* Virtual Tour / Gallery */}
            <section className="space-y-8">
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <Building2 size={14} /> Virtual Facility Tour
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {galleryImages.map((img, i) => (
                  <div key={i} className="group relative aspect-video rounded-3xl overflow-hidden shadow-xl">
                    <img src={img.url} alt={img.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-white text-[10px] font-black uppercase tracking-widest">{img.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'directory' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="relative group max-w-xl">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
              <input
                type="text"
                placeholder="Search departments or specialists..."
                className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-white/5 border-2 border-transparent rounded-3xl focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 outline-none transition-all font-bold text-slate-900 dark:text-white shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <div key={dept.name} className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[32px] shadow-sm hover:shadow-xl hover:border-blue-500/20 transition-all flex items-center justify-between group">
                  <div className="space-y-2">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{dept.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dept.doctors} Active Specialists</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue</p>
                    <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-blue-600 text-[10px] font-black uppercase tracking-widest">{dept.waitTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'resources' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { label: 'Patient Intake Form', size: '1.2 MB', type: 'PDF' },
              { label: 'Insurance List 2024', size: '450 KB', type: 'PDF' },
              { label: 'Facility Map', size: '5.4 MB', type: 'JPG' },
            ].map((res, i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 rounded-[32px] flex flex-col items-center text-center space-y-6 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xl transition-all cursor-pointer group">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                  <FileDown size={32} />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{res.label}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">{res.type} • {res.size}</p>
                </div>
                <button className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] group-hover:underline">Download Resource</button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
