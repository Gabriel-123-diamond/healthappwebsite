import React from 'react';
import { CheckCircle2, Award } from 'lucide-react';

export default function ExpertServicesList() {
  const services = [
    { title: 'Clinical Consultation', desc: 'In-depth assessment of your health concerns.' },
    { title: 'Diagnostic Review', desc: 'Expert analysis of medical records and labs.' },
    { title: 'Integrative Wellness', desc: 'Personalized plans bridging orthodox and herbal wisdom.' },
    { title: 'Follow-up Protocol', desc: 'Continuous monitoring and adjustment of care.' }
  ];
  
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Award size={20} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Clinical Services</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map((service, i) => (
          <div key={i} className="p-5 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-4 transition-all hover:border-blue-500/30 group">
            <div className="mt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{service.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{service.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
