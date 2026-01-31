'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Mock Admin Auth - In production use Firebase Custom Claims or a separate Admin collection
    if (password === 'Diamond1234@') {
      sessionStorage.setItem('isAdmin', 'true');
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1000);
    } else {
      setTimeout(() => {
        setError('Invalid admin password');
        setLoading(false);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-slate-900" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500">Restricted access only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Access Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none"
              placeholder="Enter admin password"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
