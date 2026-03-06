'use client';

import { useState } from 'react';
import { PasswordField } from '@/components/common/PasswordField';

export default function SeedPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');

  const handleSeed = async () => {
    if (!password) {
      setStatus('error');
      setMessage('Please enter the admin password.');
      return;
    }

    setStatus('loading');
    setMessage('');
    
    try {
      const response = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
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
    <div className="max-w-3xl mx-auto px-4 pt-32 sm:pt-40 pb-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-6 dark:text-white">Database Seeding</h1>
      <p className="text-slate-600 mb-8 dark:text-slate-400">
        This tool populates the database with initial mock data, including experts and articles. 
        Use this only for development or initial setup purposes.
      </p>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="w-full max-w-xs">
            <PasswordField
              id="admin-password"
              name="password"
              label="Admin Password"
              labelClassName="block text-sm font-bold text-slate-900 dark:text-slate-200 mb-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              prefixIcon={null}
            />
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
