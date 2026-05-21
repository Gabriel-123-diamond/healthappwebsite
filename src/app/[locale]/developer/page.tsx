'use client';

import React, { useEffect, useState } from 'react';
import { apiKeyService, APIKey } from '@/services/apiServiceKey';
import { Key, Plus, Loader2, Code } from 'lucide-react';
import NiceModal from '@/components/common/NiceModal';
import { 
  APIKeyCard, IntegrationGuide, APIStatus, InstitutionalAPICard 
} from '@/components/developer/DeveloperComponents';

export default function DeveloperPage() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewPostName] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm
    });
  };

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
      showAlert('API Key Generated', 'Your new access key has been successfully created and encrypted.', 'success');
    } catch (error) {
      showAlert('Generation Failed', 'We could not generate your API key. Please check your connection.', 'warning');
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm(
      "Confirm Revocation",
      "Are you sure you want to delete this API key? Any applications or hospital portals using it will immediately lose access to health data.",
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await apiKeyService.deleteKey(id);
          setKeys(keys.filter(k => k.id !== id));
          showAlert('Access Revoked', 'The API key has been removed.', 'success');
        } catch (error) {
          showAlert('Action Failed', 'Could not delete the API key. Please try again.', 'warning');
        }
      }
    );
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
            Manage your API keys to integrate Ikiké Health Data into your hospital or research platform.
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
                    <APIKeyCard 
                      key={apiKey.id} 
                      apiKey={apiKey} 
                      onCopy={copyToClipboard} 
                      onDelete={handleDelete} 
                      isCopied={copiedId === apiKey.id} 
                    />
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

            <IntegrationGuide />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <APIStatus />
            <InstitutionalAPICard />
          </aside>

        </div>
      </div>

      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText="Got it"
      />

      <NiceModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Confirm Revocation"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}
