import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Lock, Globe, Code } from 'lucide-react';

export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: 'API Key' | 'User Token' | 'Admin Session';
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
  responseExample: any;
}

export const ApiReferenceItem = ({ endpoint }: { endpoint: ApiEndpoint }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-emerald-500 bg-emerald-500/10';
      case 'POST': return 'text-blue-500 bg-blue-500/10';
      case 'DELETE': return 'text-red-500 bg-red-500/10';
      default: return 'text-slate-500 bg-slate-500/10';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-white/5 overflow-hidden transition-all hover:shadow-lg dark:hover:shadow-blue-900/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-6 flex items-center justify-between group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <code className="text-sm font-mono font-bold text-slate-900 dark:text-white truncate">
            {endpoint.path}
          </code>
          <span className="hidden md:flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">
            {endpoint.auth === 'API Key' ? <Globe size={12} /> : <Lock size={12} />}
            {endpoint.auth}
          </span>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-6 pb-8 space-y-6 border-t border-slate-50 dark:border-white/5 pt-6"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {endpoint.description}
          </p>

          {endpoint.parameters && endpoint.parameters.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Code size={12} /> Parameters
              </h4>
              <div className="bg-slate-50 dark:bg-black/20 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/5">
                      <th className="p-4 font-bold text-slate-900 dark:text-white">Name</th>
                      <th className="p-4 font-bold text-slate-900 dark:text-white">Type</th>
                      <th className="p-4 font-bold text-slate-900 dark:text-white">Required</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {endpoint.parameters.map(param => (
                      <tr key={param.name}>
                        <td className="p-4 font-mono text-blue-600 dark:text-blue-400">{param.name}</td>
                        <td className="p-4 text-slate-500">{param.type}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${param.required ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                            {param.required ? 'Required' : 'Optional'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ChevronRight size={12} className="rotate-90" /> Response Example
            </h4>
            <div className="bg-slate-900 rounded-2xl p-6 font-mono text-[11px] text-emerald-400 overflow-x-auto shadow-inner">
              <pre>{JSON.stringify(endpoint.responseExample, null, 2)}</pre>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
