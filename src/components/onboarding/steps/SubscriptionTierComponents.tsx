import React from 'react';
import { Check, Loader2 } from 'lucide-react';

export interface Tier {
  id: string;
  name: string;
  description?: string;
  price: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
}

export const TierButton = ({ 
  tier, 
  isSelected, 
  isProcessing, 
  isDisabled, 
  onClick 
}: { 
  tier: Tier, 
  isSelected: boolean, 
  isProcessing: boolean, 
  isDisabled: boolean, 
  onClick: () => void 
}) => (
  <button
    disabled={isDisabled}
    onClick={onClick}
    className={`flex flex-col p-8 rounded-[40px] border-2 text-left transition-all duration-500 relative group ${
      isSelected
        ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/30'
        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-blue-500/30'
    } ${isDisabled && !isProcessing ? 'opacity-50 grayscale' : ''}`}
  >
    {tier.popular && !isSelected && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg">
        Most Popular
      </div>
    )}

    <div className="flex justify-between items-start mb-8">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
        isSelected ? 'bg-white/20 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
      }`}>
        {isProcessing ? <Loader2 className="w-6 h-6 animate-spin" /> : tier.icon}
      </div>
      <div className="text-right">
        <p className={`text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>{tier.price}</p>
        <p className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>per month</p>
      </div>
    </div>

    <h4 className={`text-xl font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
      {tier.name}
    </h4>

    {tier.description && (
      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 mb-6 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
        {tier.description}
      </p>
    )}

    <ul className="space-y-4 flex-1">
      {tier.features.map((feat, idx) => (
        <li key={`${feat}-${idx}`} className={`flex items-center gap-3 ${!feat ? 'h-6' : ''}`}>
          {feat ? (
            <>
              <div className={`shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600'}`}>
                <Check size={10} strokeWidth={4} />
              </div>
              <span className={`text-xs font-bold ${isSelected ? 'text-blue-50' : 'text-slate-500 dark:text-slate-400'}`}>{feat}</span>
            </>
          ) : null}
        </li>
      ))}
    </ul>

    <div className={`mt-auto w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all ${
      isSelected ? 'bg-white text-blue-600 shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white'
    }`}>
      {isProcessing ? 'Securing Channel...' : isSelected ? 'Selected Node' : 'Initialize Tier'}
    </div>
  </button>
);
