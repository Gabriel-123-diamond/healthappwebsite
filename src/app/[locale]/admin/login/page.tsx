'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { PasswordField } from '@/components/common/PasswordField';

export default function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Authentication is now handled by an HTTP-only cookie set by the server.
        // We set a non-sensitive flag for UI routing purposes.
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Invalid admin password');
        setLoading(false);
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl p-10 w-full max-w-md border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Admin Access</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">Authenticated personnel only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <PasswordField
            id="admin-login-password"
            name="password"
            label="Security Key"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter security key"
            prefixIcon={null}
          />

          {error && (
            <div className="text-red-600 text-xs font-black uppercase tracking-widest bg-red-50 dark:bg-red-900/20 p-4 rounded-2xl text-center border border-red-100 dark:border-red-900/30 animate-shake">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 dark:shadow-none disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Decrypt Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
