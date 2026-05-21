import React from 'react';
import { Key, Plus, Trash2, Copy, Check, Loader2, Code, Terminal, Book } from 'lucide-react';
import { APIKey } from '@/services/apiServiceKey';
import { Link } from '@/i18n/routing';

export const APIKeyCard = ({ 
  apiKey, 
  onCopy, 
  onDelete, 
  isCopied 
}: { 
  apiKey: APIKey, 
  onCopy: (text: string, id: string) => void, 
  onDelete: (id: string) => void, 
  isCopied: boolean 
}) => (
  <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
    <div>
      <div className="font-bold text-slate-900 dark:text-white mb-1">{apiKey.name}</div>
      <code className="text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono text-blue-600 dark:text-blue-400">
        {apiKey.key.substring(0, 8)}****************{apiKey.key.substring(apiKey.key.length - 4)}
      </code>
    </div>
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onCopy(apiKey.key, apiKey.id)}
        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
        title="Copy Key"
      >
        {isCopied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
      </button>
      <button 
        onClick={() => onDelete(apiKey.id)}
        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
        title="Delete Key"
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

export const IntegrationGuide = () => (
  <section className="bg-white dark:bg-[#0B1221] rounded-[32px] border border-slate-200 dark:border-white/5 p-8 text-slate-900 dark:text-white shadow-sm">
    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
      <Book className="text-blue-600 dark:text-blue-400" />
      Integration Guide
    </h2>
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">1</div>
        <div>
          <h3 className="font-bold mb-1">Authentication</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            All API requests must include your API key in the <code className="text-blue-600 dark:text-blue-400 font-bold">X-API-Key</code> header.
          </p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">2</div>
        <div>
          <h3 className="font-bold mb-1">Endpoints</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
            POST <code className="text-blue-600 dark:text-blue-400 font-bold">/api/v1/search</code>
          </p>
          <div className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 p-4 rounded-xl font-mono text-[10px] text-slate-700 dark:text-emerald-400 overflow-x-auto">
            {`// Request Body
{
  "query": "benefits of ginger",
  "mode": "herbal"
}`}
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-slate-50 dark:border-white/5">
        <Link 
          href="/developer/reference"
          className="flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-xl"
        >
          <Code size={14} />
          View Full API Reference
        </Link>
      </div>
    </div>
  </section>
);

export const APIStatus = () => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
      <Terminal size={18} className="text-slate-400" />
      API Status
    </h3>
    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
      V1 Systems Operational
    </div>
    <div className="mt-6 space-y-4">
      <div className="flex justify-between text-xs">
        <span className="text-slate-400 font-medium">Daily Limit</span>
        <span className="text-slate-900 dark:text-white font-bold">1,000 / 10,000</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 w-[10%]" />
      </div>
    </div>
  </div>
);

export const InstitutionalAPICard = () => (
  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[32px] text-white shadow-lg">
    <h3 className="font-bold mb-2">Institutional API</h3>
    <p className="text-indigo-100 text-xs leading-relaxed mb-6">
      Are you representing a hospital? Institutional accounts get higher rate limits and access to clinical protocols.
    </p>
    <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold text-xs hover:bg-indigo-50 transition-all">
      Apply for Institutional Access
    </button>
  </div>
);
