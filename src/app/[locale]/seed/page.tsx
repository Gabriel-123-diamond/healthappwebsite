'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSeed = async () => {
    if (!password) {
      setStatus('error');
      setMessage('Please enter the admin password.');
      return;
    }

    setStatus('loading');
    setMessage('');
    
    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'x-admin-password': password,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Database seeded successfully!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to seed database.');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6 dark:text-white">Database Seeding</h1>
      <p className="text-slate-600 mb-8 dark:text-slate-400">
        This tool populates the database with initial mock data, including experts and articles. 
        Use this only for development or initial setup purposes.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-xs">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2">
              Admin Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleSeed}
            disabled={status === 'loading'}
            className={`px-6 py-3 rounded-lg font-bold text-white transition-all ${
              status === 'loading'
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'
            }`}
          >
            {status === 'loading' ? 'Seeding...' : 'Seed Database'}
          </button>

          {message && (
            <div
              className={`px-4 py-3 rounded-lg text-sm font-medium w-full text-center ${
                status === 'success'
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
