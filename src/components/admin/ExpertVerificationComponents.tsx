import React from 'react';
import { ExternalLink } from 'lucide-react';

export const DocLink = ({ url, label }: { url?: string, label: string }) => {
  if (!url) return null;
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"
    >
      <ExternalLink size={12} /> View {label}
    </a>
  );
};

export const InfoItem = ({ label, value, subValue }: { label: string, value?: string, subValue?: string }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="font-bold text-slate-900 dark:text-white text-sm">{value || 'N/A'}</p>
    {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
  </div>
);
