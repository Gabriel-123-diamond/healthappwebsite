'use client';

import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function SeedDataPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Added state for password visibility

  const handleSeed = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const response = await fetch('/api/admin/seed', { // Changed endpoint to /api/admin/seed
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(`Success: ${data.message}`);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to seed data');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Database className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Seed Database</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Populate Firestore with expert data.</p>
        </div>

        <form onSubmit={handleSeed} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-950 dark:text-white mb-2">Admin Password</label>
            <div className="relative"> {/* Added relative container for toggle button */}
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-600 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10" // Added pr-10 for button spacing
                placeholder="Enter admin password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {status === 'success' && (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle className="w-5 h-5" />
              {message}
            </div>
          )}

          {status === 'error' && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-sm">
              <AlertCircle className="w-5 h-5" />
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Start Seeding'}
          </button>
        </form>
      </div>
    </div>
  );
}
