import React from 'react';
import { Award, Crown, CheckCircle2 } from 'lucide-react';

interface TierCardProps {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  isPremium?: boolean;
  isCurrent?: boolean;
  onSelect: (id: string) => void;
}

export const TierCard: React.FC<TierCardProps> = ({
  id,
  title,
  price,
  description,
  features,
  isPremium,
  isCurrent,
  onSelect
}) => {
  if (isPremium) {
    return (
      <div className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 ${isCurrent ? 'border-blue-600' : 'border-slate-800 dark:border-slate-100'} hover:border-blue-600 transition-all flex flex-col h-full shadow-2xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16" />
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div className="p-4 rounded-2xl bg-white/10 dark:bg-slate-900/5 text-blue-400">
            <Crown size={32} />
          </div>
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Max Authority</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white">{price}</span>
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-medium">{description}</p>
        <ul className="space-y-4 flex-1 relative z-10">
          {features.map((feat) => (
            <li key={feat} className="flex items-center gap-3 text-sm font-bold text-white/80 dark:text-slate-700">
              <CheckCircle2 size={16} className="text-blue-400 shrink-0" /> {feat}
            </li>
          ))}
        </ul>
        <button 
          onClick={() => onSelect(id)}
          disabled={isCurrent}
          className={`mt-8 w-full py-4 ${isCurrent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-600/20'} rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all`}
        >
          {isCurrent ? 'Current Plan' : 'Go Premium'}
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-slate-900 p-8 rounded-[40px] border-2 ${isCurrent ? 'border-blue-600' : 'border-slate-100 dark:border-slate-800'} hover:border-blue-600 transition-all flex flex-col h-full shadow-sm group`}>
      <div className="flex justify-between items-start mb-8">
        <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
          <Award size={32} />
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-black uppercase text-slate-400 tracking-widest">Initial Scale</span>
          <span className="text-3xl font-black text-slate-900 dark:text-white">{price}</span>
        </div>
      </div>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 mb-6 font-medium">{description}</p>
      <ul className="space-y-4 flex-1">
        {features.map((feat) => (
          <li key={feat} className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-400">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> {feat}
          </li>
        ))}
      </ul>
      <button 
        onClick={() => onSelect(id)}
        disabled={isCurrent}
        className={`mt-8 w-full py-4 ${isCurrent ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white group-hover:bg-blue-600 group-hover:text-white'} rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all`}
      >
        {isCurrent ? 'Current Plan' : 'Initialize Upgrade'}
      </button>
    </div>
  );
};
