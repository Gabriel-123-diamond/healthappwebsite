'use client';

import Link from 'next/link';
import { Database, Server, ChevronRight } from 'lucide-react';

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">System Tools</h1>
          <p className="mt-2 text-slate-600">Administrative utilities for managing the application.</p>
        </div>

        <div className="grid gap-6">
          {/* Standard Seed Card */}
          <Link href="/seed" className="block group">
            <div className="bg-white shadow rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Standard Seed (API V1)</h2>
                    <p className="text-slate-500 text-sm">
                      Populate database using the standard /api/seed endpoint.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          </Link>

          {/* Admin Seed Card */}
          <Link href="/admin/seed" className="block group">
            <div className="bg-white shadow rounded-xl overflow-hidden border border-slate-200 hover:border-purple-400 hover:shadow-md transition-all">
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Admin Seed (API V2)</h2>
                    <p className="text-slate-500 text-sm">
                      Advanced seeding using the /api/admin/seed endpoint.
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
