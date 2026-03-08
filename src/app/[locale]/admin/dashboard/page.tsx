'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, FileText, CheckCircle, XCircle, Shield, LogOut, Database, Loader2, Plus, Eye, Key, UserPlus, Trash2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types';
import ExpertVerificationModal from '@/components/admin/ExpertVerificationModal';
import { motion, AnimatePresence } from 'framer-motion';
import NiceModal from '@/components/common/NiceModal';

import { PasswordField } from '@/components/common/PasswordField';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isLoading, isSuper } = useAdminAuth();
  const [experts, setExperts] = useState<UserProfile[]>([]);
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<UserProfile | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<'verifications' | 'admins'>('verifications');
  
  // Create Admin Form State
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [adminName, setAdminName] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {}
  });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const showConfirm = (title: string, description: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      description,
      onConfirm
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expertsData, adminsData] = await Promise.all([
          userService.getPendingExperts(),
          isSuper ? userService.getAdmins() : Promise.resolve([])
        ]);
        setExperts(expertsData);
        setAdmins(adminsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (!isLoading) fetchData();
  }, [isLoading, isSuper]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32 sm:pt-40">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId: id, status: 'verified' }),
      });
      if (!res.ok) throw new Error('Failed to verify');
      setExperts(prev => prev.filter(e => e.uid !== id));
      setSelectedExpert(null);
      showAlert('Expert Verified', 'Expert application has been successfully verified.', 'success');
    } catch (err) {
      showAlert('Verification Failed', 'Failed to verify expert application.', 'warning');
    }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expertId: id, status: 'rejected', notes: reason }),
      });
      if (!res.ok) throw new Error('Failed to reject');
      setExperts(prev => prev.filter(e => e.uid !== id));
      setSelectedExpert(null);
      showAlert('Application Rejected', 'Expert application has been rejected.', 'info');
    } catch (err) {
      showAlert('Rejection Failed', 'Failed to reject application.', 'warning');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingAdmin(true);
    try {
      const res = await fetch('/api/admin/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPass, fullName: adminName }),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert('Admin Created', data.message || 'New admin has been created.', 'success');
        setShowAddAdmin(false);
        setAdminEmail('');
        setAdminPass('');
        setAdminName('');
        // Refresh admins
        const adminsData = await userService.getAdmins();
        setAdmins(adminsData);
      } else {
        showAlert('Creation Failed', data.error || 'Failed to create admin.', 'warning');
      }
    } catch (err) {
      showAlert('Error', 'An error occurred while creating admin.', 'warning');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    document.cookie = 'is_super_admin=; Max-Age=0; path=/';
    router.push('/');
  };

  const handleSeed = async () => {
    showConfirm(
      'System Seeding',
      'This will inject sample data into the production environment. Are you sure you wish to proceed?',
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setSeeding(true);
        try {
          const res = await fetch('/api/admin/seed', { method: 'POST' });
          if (res.ok) showAlert('Success', 'Database seeded successfully!', 'success');
          else showAlert('Error', 'Failed to seed database.', 'warning');
        } catch (err) {
          showAlert('Error', 'An error occurred while seeding database.', 'warning');
        } finally {
          setSeeding(false);
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-16">
      {/* Admin Header */}
      <div className="bg-slate-900 dark:bg-black text-white p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield className={`w-6 h-6 ${isSuper ? 'text-blue-400' : 'text-emerald-400'}`} />
            <h1 className="font-bold text-xl uppercase tracking-tighter">
              IKIKI HEALTH {isSuper ? 'SUPER ADMIN' : 'ADMIN CONSOLE'}
            </h1>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm hover:text-red-400 font-black uppercase tracking-widest transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="max-max-7xl mx-auto p-8">
        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-10 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-white/5 w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('verifications')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'verifications' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            Verifications
          </button>
          {isSuper && (
            <button 
              onClick={() => setActiveTab('admins')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'admins' ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
            >
              Admin Grid
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'verifications' ? (
            <motion.div 
              key="verif"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard icon={<Users />} label="Pending Applications" value={experts.length.toString()} color="bg-blue-50 text-blue-600" />
                <StatCard icon={<Shield />} label="System Status" value="Active" color="bg-emerald-50 text-emerald-600" />
                <div className="md:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-4 bg-amber-50 rounded-2xl text-amber-600"><Database size={24} /></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">Maintenance</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">Live Data Synchronization</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button onClick={handleSeed} disabled={seeding} className="px-4 py-2 bg-amber-100 text-amber-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-200 transition-all disabled:opacity-50">
                        {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Seed V2'}
                      </button>
                      <Link href="/admin/learning/create" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2">
                        <Plus size={14} /> Course
                      </Link>
                   </div>
                </div>
              </div>

              {/* Pending Experts Table */}
              <div className="bg-white dark:bg-slate-900 rounded-[40px] shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
                <div className="p-8 border-b border-slate-100 dark:border-white/5">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Expert Pipeline</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Authorized clinical verification queue</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 dark:bg-white/[0.02] text-slate-400 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="p-8">Candidate / Identity</th>
                        <th className="p-8">Protocol Info</th>
                        <th className="p-8 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {experts.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No pending protocols in queue</td>
                        </tr>
                      ) : (
                        experts.map((expert) => (
                          <tr key={expert.uid} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                            <td className="p-8">
                              <div>
                                <p className="font-black text-slate-900 dark:text-white text-lg uppercase tracking-tight">{expert.fullName}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">{expert.expertProfile?.type || expert.role}</p>
                              </div>
                            </td>
                            <td className="p-8">
                              <div className="space-y-1">
                                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{expert.email}</p>
                                <p className="text-xs text-slate-400">{expert.expertProfile?.specialty || 'N/A'}</p>
                              </div>
                            </td>
                            <td className="p-8 text-right">
                              <button 
                                onClick={() => setSelectedExpert(expert)}
                                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 dark:hover:bg-blue-400 transition-all shadow-lg active:scale-95 ml-auto"
                              >
                                <Eye className="w-4 h-4 inline mr-2" /> Decrypt Data
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="admins"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Authorized Administrators</h2>
                  <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px] font-black">Super User Authority Node</p>
                </div>
                <button 
                  onClick={() => setShowAddAdmin(true)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 dark:shadow-none"
                >
                  <UserPlus size={18} /> Add Authority
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                  <div key={admin.uid} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm relative group">
                    <div className="w-14 h-14 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center text-white dark:text-slate-900 mb-6 group-hover:rotate-6 transition-transform">
                      <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1">{admin.fullName || 'Admin Node'}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">{admin.email}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                          <CheckCircle size={12} /> Active Access
                       </span>
                       <button className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden p-10 border border-white/10"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Initialize Admin</h2>
              <button onClick={() => setShowAddAdmin(false)}><XCircle className="text-slate-300" /></button>
            </div>
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Display Name</label>
                <input required type="text" value={adminName} onChange={e => setAdminName(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none outline-none font-bold text-sm" placeholder="Protocol Officer" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Email Identity</label>
                <input required type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border-none outline-none font-bold text-sm" placeholder="admin@ikike.health" />
              </div>
              <div className="space-y-2 pb-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Security Key</label>
                <PasswordField
                  id="admin-password"
                  name="admin-password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••••••"
                  className="dark:bg-white/5"
                />
              </div>
              <button disabled={creatingAdmin} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all">
                {creatingAdmin ? <Loader2 className="animate-spin" /> : <><Key size={16}/> Activate Access</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}

      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText="Got it"
      />

      <NiceModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Confirm Action"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-white/5 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`p-4 ${color} rounded-2xl`}>
          {React.cloneElement(icon as React.ReactElement, { size: 24 } as any)}
        </div>
        <div>
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1">{label}</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{value}</p>
        </div>
      </div>
    </div>
  );
}
