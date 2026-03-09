'use client';

import React from 'react';
import { Shield, LogOut, Loader2 } from 'lucide-react';
import ExpertVerificationModal from '@/components/admin/ExpertVerificationModal';
import { AnimatePresence } from 'framer-motion';
import NiceModal from '@/components/common/NiceModal';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { VerificationTab } from '@/components/admin/VerificationTab';
import { AdminGridTab } from '@/components/admin/AdminGridTab';
import { AddAdminModal } from '@/components/admin/AddAdminModal';

export default function AdminDashboardPage() {
  const {
    isLoading,
    isSuper,
    experts,
    admins,
    loading,
    selectedExpert,
    setSelectedExpert,
    seeding,
    activeTab,
    setActiveTab,
    showAddAdmin,
    setShowAddAdmin,
    adminEmail,
    setAdminEmail,
    adminPass,
    setAdminPass,
    adminName,
    setAdminName,
    creatingAdmin,
    modalConfig,
    setModalConfig,
    confirmConfig,
    setConfirmConfig,
    handleVerify,
    handleReject,
    handleCreateAdmin,
    handleLogout,
    handleSeed,
  } = useAdminDashboard();

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 pt-32 sm:pt-40">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

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
            <VerificationTab 
              experts={experts}
              seeding={seeding}
              handleSeed={handleSeed}
              setSelectedExpert={setSelectedExpert}
            />
          ) : (
            <AdminGridTab 
              admins={admins}
              setShowAddAdmin={setShowAddAdmin}
            />
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
      <AddAdminModal 
        showAddAdmin={showAddAdmin}
        setShowAddAdmin={setShowAddAdmin}
        adminName={adminName}
        setAdminName={setAdminName}
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        adminPass={adminPass}
        setAdminPass={setAdminPass}
        creatingAdmin={creatingAdmin}
        handleCreateAdmin={handleCreateAdmin}
      />

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
