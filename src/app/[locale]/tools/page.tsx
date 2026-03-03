'use client';

import { Database, Server, ChevronRight, ChevronLeft } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';

export default function ToolsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 sm:pt-40 pb-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-black uppercase tracking-widest text-[10px] mb-8 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </button>

        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">System Tools</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-medium">Administrative utilities for managing the application infrastructure.</p>
        </div>

        <div className="grid gap-6">
          {/* Admin Seed Card */}
          <Link href="/admin/seed" className="block group">
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 hover:shadow-2xl transition-all shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Server className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase tracking-tight">Database Seeding (API V2)</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      Secure seeding using the /api/admin/seed endpoint. Supports HMAC-SHA256 authentication protocols.
                    </p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
