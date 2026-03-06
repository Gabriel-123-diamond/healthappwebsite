'use client';

import React, { useEffect, useState } from 'react';
import { apiKeyService, APIKey } from '@/services/apiServiceKey';
import { Key, Plus, Trash2, Copy, Check, Loader2, Code, Terminal, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeveloperPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewPostName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    apiKeyService.getMyKeys().then(data => {
      setKeys(data);
      setLoading(false);
    });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;
    setGenerating(true);
    try {
      await apiKeyService.generateKey(newKeyName);
      setNewPostName('');
      const updatedKeys = await apiKeyService.getMyKeys();
      setKeys(updatedKeys);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this API key? Any applications using it will lose access.")) return;
    await apiKeyService.deleteKey(id);
    setKeys(keys.filter(k => k.id !== id));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-12 px-4 transition-colors">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-xs mb-3">
            <Code size={14} /> Advanced Integrations
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Developer Settings</h1>
          <p className="text-slate-500 max-w-2xl text-lg">
            Manage your API keys to integrate Ikiké Health Intelligence into your hospital or research platform.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Key Management */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Key className="text-blue-600" size={20} />
                  Your API Keys
                </h2>
              </div>

              {loading ? (
                <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
              ) : keys.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                  <p className="text-slate-400 font-medium">You haven't generated any API keys yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {keys.map((apiKey) => (
                    <div key={apiKey.id} className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 transition-all flex justify-between items-center bg-slate-50/30 dark:bg-slate-800/30">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white mb-1">{apiKey.name}</div>
                        <code className="text-xs bg-white dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 font-mono text-blue-600 dark:text-blue-400">
                          {apiKey.key.substring(0, 8)}****************{apiKey.key.substring(apiKey.key.length - 4)}
                        </code>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                          className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                          title="Copy Key"
                        >
                          {copiedId === apiKey.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                        </button>
                        <button 
                          onClick={() => handleDelete(apiKey.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Key"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleGenerate} className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800 flex gap-3">
                <input 
                  type="text" 
                  value={newKeyName}
                  onChange={(e) => setNewPostName(e.target.value)}
                  placeholder="App Name (e.g. Hospital Portal)"
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
                <button 
                  disabled={generating || !newKeyName.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                >
                  {generating ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                  Generate New Key
                </button>
              </form>
            </section>

            {/* Quick Documentation */}
            <section className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-blue-900/20">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Book className="text-blue-400" />
                Integration Guide
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">1</div>
                  <div>
                    <h3 className="font-bold mb-1">Authentication</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      All API requests must include your API key in the <code className="text-blue-400">X-API-Key</code> header.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm shrink-0">2</div>
                  <div>
                    <h3 className="font-bold mb-1">Endpoints</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      POST <code className="text-blue-400">/api/v1/search</code>
                    </p>
                    <div className="bg-black/50 p-4 rounded-xl font-mono text-[10px] text-emerald-400 overflow-x-auto">
                      {`// Request Body
{
  "query": "benefits of ginger",
  "mode": "herbal"
}`}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
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

            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-[32px] text-white shadow-lg">
              <h3 className="font-bold mb-2">Institutional API</h3>
              <p className="text-indigo-100 text-xs leading-relaxed mb-6">
                Are you representing a hospital? Institutional accounts get higher rate limits and access to clinical protocols.
              </p>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-bold text-xs hover:bg-indigo-50 transition-all">
                Apply for Institutional Access
              </button>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
