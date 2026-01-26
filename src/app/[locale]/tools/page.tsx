'use client';

import { useState } from 'react';
import { seedExperts } from '@/services/directoryService';
import { Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ToolsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    try {
      setStatus('loading');
      setMessage('Seeding database with initial expert data...');
      await seedExperts();
      setStatus('success');
      setMessage('Successfully seeded experts collection!');
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setMessage(`Error seeding database: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">System Tools</h1>
          <p className="mt-2 text-slate-600">Administrative utilities for managing the application.</p>
        </div>

        <div className="bg-white shadow rounded-xl overflow-hidden border border-slate-200">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <Database className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-slate-900">Database Management</h2>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-slate-900 mb-2">Seed Initial Data</h3>
              <p className="text-sm text-slate-500 mb-4">
                Populate the Firestore 'experts' collection with initial mock data. 
                <span className="text-amber-600 block mt-1">Warning: This will clear existing data in the experts collection.</span>
              </p>
              
              <button
                onClick={handleSeed}
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'loading' ? 'Seeding...' : 'Seed Experts Database'}
              </button>
            </div>

            {status !== 'idle' && (
              <div className={`rounded-lg p-4 flex items-start gap-3 ${
                status === 'success' ? 'bg-green-50 text-green-700' : 
                status === 'error' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
              }`}>
                {status === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
                 status === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> :
                 <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />}
                
                <div className="text-sm font-medium">{message}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
