import React from 'react';
import { MatrixCategory, MatrixRow } from './UpgradeComponents';
import { useTranslations } from 'next-intl';

export const UpgradeMatrix = () => {
  const t = useTranslations('upgrade');

  return (
    <section className="mt-40 mb-32 relative">
      <div className="text-center mb-20 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
          {t('technicalSpecification')}
        </div>
        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          {t('matrixTitle').split(' ')[0]} <span className="text-blue-600">{t('matrixTitle').split(' ')[1]}</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
          {t('matrixSubtitle')}
        </p>
      </div>

      <div className="relative group">
        <div className="absolute -inset-4 bg-gradient-to-b from-blue-600/5 to-indigo-600/5 blur-3xl rounded-[64px] opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <div className="relative bg-white dark:bg-slate-900 rounded-[48px] border border-slate-200/60 dark:border-white/5 shadow-2xl overflow-hidden shadow-slate-200/50 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 min-w-[900px]">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-white/[0.02] backdrop-blur-md">
                  <th className="p-10 text-left w-1/3 border-b border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{t('protocolNode')}</span>
                  </th>
                  {['Basic', 'Plus', 'Premium'].map((tier) => (
                    <th key={tier} className="p-10 text-center border-b border-slate-100 dark:border-white/5">
                      <span className={`text-xs font-black uppercase tracking-widest ${
                        tier === 'Plus' ? 'text-blue-600' : tier === 'Premium' ? 'text-indigo-500' : 'text-slate-900 dark:text-white'
                      }`}>{tier}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <MatrixCategory title="Core Foundations" />
                <MatrixRow name="Public Symptom Search" basic={true} plus={true} premium={true} />
                <MatrixRow name="Health Articles & Feed" basic={true} plus={true} premium={true} />
                <MatrixRow name="Expert Directory Access" basic={true} plus={true} premium={true} />
                
                <MatrixCategory title="Advanced Health Data" />
                <MatrixRow name="AI Symptom Checker" basic="Basic" plus="Advanced" premium="Unlimited" />
                <MatrixRow name="Personalized Insights" basic={false} plus={true} premium={true} />
                <MatrixRow name="Health History Tracking" basic={false} plus={true} premium={true} />
                <MatrixRow name="Medical Vault (Encrypted)" basic={false} plus={true} premium={true} />
                
                <MatrixCategory title="Network Benefits" />
                <MatrixRow name="Priority Search Results" basic={false} plus={true} premium={true} />
                <MatrixRow name="Early Feature Access" basic={false} plus={false} premium={true} />
                
                <MatrixCategory title="Premium Health Services" />
                <MatrixRow name="Direct Video Consultations" basic={false} plus={false} premium={true} />
                <MatrixRow name="Unlimited Expert Q&A" basic={false} plus={false} premium={true} />
                <MatrixRow name="Family Sharing (4 Members)" basic={false} plus={false} premium={true} />
                <MatrixRow name="Medication Reminders" basic={false} plus={false} premium={true} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
