'use client';

import Link from 'next/link';
import { Database, Server, ChevronRight } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors pt-24 sm:pt-32">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">System Tools</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Administrative utilities for managing the application.</p>
        </div>

        <div className="grid gap-6">
          {/* Admin Seed Card */}
          <Link href="/admin/seed" className="block group">
            <div className="bg-white dark:bg-slate-900 shadow rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md transition-all">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Database Seeding (API V2)</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Secure seeding using the /api/admin/seed endpoint. Supports HMAC-SHA256 authentication.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
