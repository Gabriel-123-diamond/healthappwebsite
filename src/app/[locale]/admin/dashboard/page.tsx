'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileText, CheckCircle, XCircle, Shield, LogOut, Database, Loader2 } from 'lucide-react';

interface PendingExpert {
  id: string;
  name: string;
  role: string;
  email: string;
  status: 'pending';
}

const MOCK_PENDING_EXPERTS: PendingExpert[] = [
  { id: '1', name: 'Dr. Emily Stone', role: 'Medical Doctor', email: 'emily@hospital.com', status: 'pending' },
  { id: '2', name: 'Ayush Gupta', role: 'Herbalist', email: 'ayush@nature.org', status: 'pending' },
  { id: '3', name: 'Sarah Connor', role: 'Nutritionist', email: 'sarah@nutrition.com', status: 'pending' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [experts, setExperts] = useState<PendingExpert[]>(MOCK_PENDING_EXPERTS);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const isAdmin = sessionStorage.getItem('isAdmin');
    if (!isAdmin) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleVerify = (id: string) => {
    if (confirm('Verify this expert? They will be listed in the directory.')) {
      setExperts(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleReject = (id: string) => {
    if (confirm('Reject this application?')) {
      setExperts(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    router.push('/');
  };

  const handleSeed = async () => {
    if (!confirm('This will add sample data to the live database. Continue?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      if (res.ok) alert('Database seeded successfully!');
      else alert('Failed to seed database.');
    } catch (e) {
      console.error(e);
      alert('Error seeding database');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Header */}
      <div className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h1 className="font-bold text-xl">HealthAI Admin</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-slate-300">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-slate-900">1,245</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Verified Experts</p>
                <p className="text-2xl font-bold text-slate-900">84</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Articles</p>
                <p className="text-2xl font-bold text-slate-900">320</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Database Tools</p>
                <p className="text-2xl font-bold text-slate-900">Maintenance</p>
              </div>
            </div>
            <button 
              onClick={handleSeed}
              disabled={seeding}
              className="w-full bg-amber-50 text-amber-700 py-2 rounded-lg text-sm font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-2"
            >
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Seed Mock Data'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-900">Pending Expert Verifications</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm uppercase">
                <tr>
                  <th className="p-6">Name</th>
                  <th className="p-6">Role</th>
                  <th className="p-6">Email</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {experts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500">No pending requests.</td>
                  </tr>
                ) : (
                  experts.map((expert) => (
                    <tr key={expert.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-6 font-bold text-slate-900">{expert.name}</td>
                      <td className="p-6 text-slate-600">{expert.role}</td>
                      <td className="p-6 text-slate-500">{expert.email}</td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleVerify(expert.id)}
                            className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-emerald-200 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" /> Verify
                          </button>
                          <button 
                            onClick={() => handleReject(expert.id)}
                            className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-200 transition-colors"
                          >
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}