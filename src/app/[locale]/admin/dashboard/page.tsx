'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileText, CheckCircle, XCircle, Shield, LogOut, Database, Loader2, Plus, Eye } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types';
import ExpertVerificationModal from '@/components/admin/ExpertVerificationModal';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isLoading } = useAdminAuth();
  const [experts, setExperts] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<UserProfile | null>(null);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const data = await userService.getPendingExperts();
        setExperts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading) fetchExperts();
  }, [isLoading]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expertId: id, status: 'verified' }),
      });

      if (!res.ok) throw new Error('Failed to verify');

      setExperts(prev => prev.filter(e => e.uid !== id));
      setSelectedExpert(null);
      alert('Expert verified successfully!');
    } catch (err) {
      alert('Failed to verify expert.');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ expertId: id, status: 'rejected', notes: reason }),
      });

      if (!res.ok) throw new Error('Failed to reject');

      setExperts(prev => prev.filter(e => e.uid !== id));
      setSelectedExpert(null);
      alert('Application rejected.');
    } catch (err) {
      alert('Failed to reject application.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    router.push('/');
  };

  const handleSeed = async () => {
    if (!confirm('This will add sample data to the live database. Continue?')) return;
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      {/* Admin Header */}
      <div className="bg-slate-900 dark:bg-black text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h1 className="font-bold text-xl uppercase tracking-tighter">IKIKI HEALTH ADMIN</h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-slate-300 font-bold uppercase tracking-widest transition-colors">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Total Users</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">1,245</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Verified Experts</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">84</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Total Articles</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">320</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Maintenance</p>
                <p className="text-lg font-black text-slate-900 dark:text-white">Database Tools</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleSeed}
                disabled={seeding}
                className="flex-1 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors flex items-center justify-center gap-2"
              >
                {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Seed DB'}
              </button>
              <Link 
                href="/admin/learning/create"
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> Course
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden transition-colors">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center transition-colors">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Pending Expert Verifications</h2>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">Review credentials and identities</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/50">
                {experts.length} Pending
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <tr>
                  <th className="p-8">Name / Role</th>
                  <th className="p-8">Contact Info</th>
                  <th className="p-8">Specialty</th>
                  <th className="p-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {experts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="w-12 h-12 text-slate-200 dark:text-slate-800" />
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Great! No pending requests.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  experts.map((expert) => (
                    <tr key={expert.uid} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                      <td className="p-8">
                        <div>
                          <p className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">{expert.fullName}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors">{expert.expertProfile?.type || expert.role}</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{expert.email}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">{expert.phone || expert.expertProfile?.phoneNumber}</p>
                        </div>
                      </td>
                      <td className="p-8">
                        <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700">
                          {expert.expertProfile?.specialty || 'N/A'}
                        </span>
                      </td>
                      <td className="p-8 text-right">
                        <button 
                          onClick={() => setSelectedExpert(expert)}
                          className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-lg shadow-slate-200 dark:shadow-none ml-auto"
                        >
                          <Eye className="w-4 h-4" /> Review Application
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {selectedExpert && (
        <ExpertVerificationModal 
          expert={selectedExpert}
          onClose={() => setSelectedExpert(null)}
          onVerify={handleVerify}
          onReject={handleReject}
        />
      )}
    </div>
  );
}