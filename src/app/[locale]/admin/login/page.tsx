'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2 } from 'lucide-react';
import { PasswordField } from '@/components/common/PasswordField';
import { motion } from 'framer-motion';

import { auth } from '@/lib/firebase';

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
      const uid = auth.currentUser?.uid;
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, uid }),
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 pt-32 sm:pt-40 transition-colors">
      <div className="bg-white dark:bg-[#0B1221] rounded-[32px] shadow-2xl p-10 w-full max-w-md border border-slate-100 dark:border-white/5">
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-start gap-4"
            >
              <div className="shrink-0 w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20">
                <Lock className="text-white w-4 h-4" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Security Alert</p>
                <p className="text-red-600 dark:text-red-400 text-[11px] font-bold leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 dark:shadow-none disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Decrypt Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
