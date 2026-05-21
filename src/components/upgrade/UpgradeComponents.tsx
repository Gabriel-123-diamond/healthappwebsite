import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Zap, Crown, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const TierCard = ({
  title, price, features, buttonText, onUpgrade, isCurrent, isPremium, isSubmitting, icon: Icon, color, status
}: {
  title: string, price: string, features: string[], buttonText: string, onUpgrade?: () => void, isCurrent?: boolean, isPremium?: boolean, isSubmitting?: boolean, icon: any, color: string, status?: 'active' | 'included' | 'available'
}) => {
  const t = useTranslations('upgrade');

  const getButtonContent = () => {
    if (isSubmitting) return <Loader2 className="w-4 h-4 animate-spin mx-auto" />;
    
    if (status === 'active') return t('activeNode');
    if (status === 'included') return t('includedInPlan', { defaultMessage: 'Included in Plan' });
    
    return buttonText;
  };

  const isDisabled = status === 'active' || status === 'included' || isSubmitting;

  return (
    <div className={`relative group ${status === 'included' ? 'opacity-70' : ''}`}>
      <div className={`absolute inset-0 bg-${color}-600 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity`} />
      <div className={`relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 ${status === 'active' ? (isPremium ? 'border-indigo-500 shadow-indigo-500/10' : 'border-blue-500 shadow-blue-500/10') : 'border-slate-100 dark:border-slate-800'} ${!isDisabled && !isPremium ? `hover:border-${color}-600` : ''} transition-all flex flex-col h-full shadow-xl`}>
        {isPremium && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded-full">
            {t('fullAccess')}
          </div>
        )}
        <div className="flex justify-between items-start mb-8">
          <div className={`p-4 rounded-2xl ${isPremium ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : `bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600`}`}>
            <Icon size={32} />
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">{price === t('free') ? t('currentTier') : t('monthly')}</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{price}</span>
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">{title}</h3>
        <ul className="space-y-4 flex-1">
          {features.map((feat, idx) => (
            <li key={`${feat}-${idx}`} className={`flex items-center gap-3 ${!feat ? 'h-4' : ''}`}>
              {feat ? (
                <>
                  <CheckCircle2 size={16} className={`${isPremium ? 'text-indigo-500' : 'text-emerald-500'} shrink-0`} /> 
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{feat}</span>
                </>
              ) : null}
            </li>
          ))}
        </ul>
        <button 
          onClick={onUpgrade}
          disabled={isDisabled}
          className={`mt-8 w-full py-4 ${
            status === 'included' 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' 
              : isPremium ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : `bg-${color}-600 hover:bg-${color}-700 text-white`
          } rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg disabled:opacity-50 transition-all`}
        >
          {getButtonContent()}
        </button>
      </div>
    </div>
  );
};

export const MatrixCell = ({ value, color }: { value: any, color: string }) => {
  if (typeof value === 'string') {
    return <span className={`text-[10px] font-black uppercase tracking-widest ${
      color === 'blue' ? 'text-blue-600' : color === 'indigo' ? 'text-indigo-500' : 'text-slate-400'
    }`}>{value}</span>;
  }
  
  if (value === true) {
    return (
      <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${
        color === 'blue' ? 'bg-blue-600 text-white' : color === 'indigo' ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'
      } shadow-lg shadow-current/20`}>
        <CheckCircle2 size={14} />
      </div>
    );
  }
  
  return <div className="w-1.5 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto opacity-50" />;
};

export const MatrixCategory = ({ title }: { title: string }) => (
  <tr>
    <td colSpan={4} className="p-6 bg-slate-50/50 dark:bg-white/[0.02] border-y border-slate-100 dark:border-white/5">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-4">{title}</span>
    </td>
  </tr>
);

export const MatrixRow = ({ name, basic, plus, premium }: { name: string, basic: any, plus: any, premium: any }) => (
  <tr className="group hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors">
    <td className="p-6 pl-10 border-b border-slate-100 dark:border-white/5">
      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors">{name}</span>
    </td>
    <td className="p-6 text-center border-b border-slate-100 dark:border-white/5">
      <MatrixCell value={basic} color="slate" />
    </td>
    <td className="p-6 text-center border-b border-slate-100 dark:border-white/5">
      <MatrixCell value={plus} color="blue" />
    </td>
    <td className="p-6 text-center border-b border-slate-100 dark:border-white/5">
      <MatrixCell value={premium} color="indigo" />
    </td>
  </tr>
);

export const SecurityBanner = () => {
  const t = useTranslations('upgrade');
  return (
    <div className="mt-20 p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center gap-8 shadow-sm">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
        <Shield size={32} />
      </div>
      <div className="flex-1 space-y-1 text-center md:text-left">
        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('securedProtocol')}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {t('securedProtocolDesc')}
        </p>
      </div>
      <Link href="/privacy" className="px-8 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
        {t('securitySpecs')}
      </Link>
    </div>
  );
};
