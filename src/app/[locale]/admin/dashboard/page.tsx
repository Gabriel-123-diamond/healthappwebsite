'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';
import ExpertVerificationModal from '@/components/admin/ExpertVerificationModal';
import { AnimatePresence } from 'framer-motion';
import NiceModal from '@/components/common/NiceModal';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { VerificationTab } from '@/components/admin/VerificationTab';
import { TierUpgradeTab } from '@/components/admin/TierUpgradeTab';
import { AdminGridTab } from '@/components/admin/AdminGridTab';
import { AnalyticsTab } from '@/components/admin/AnalyticsTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { AddAdminModal } from '@/components/admin/AddAdminModal';
import { UserEditModal } from '@/components/admin/UserEditModal';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function AdminDashboardPage() {
  const {
    isLoading,
    isSuper,
    experts,
    verifiedExperts,
    tierUpgrades,
    admins,
    users,
    analytics,
    loading,
    selectedExpert,
    setSelectedExpert,
    selectedUser,
    setSelectedUser,
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
    handleUnverify,
    handleApproveUpgrade,
    handleRejectUpgrade,
    handleCreateAdmin,
    handleLogout,
    handleSeed,
    handleUpdateUser,
    handleToggleBlock
  } = useAdminDashboard();

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 sm:pt-32">
      <AdminHeader onLogout={handleLogout} isSuper={isSuper} />
      <div className="max-w-7xl mx-auto p-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-10 bg-white dark:bg-slate-900 p-2 rounded-3xl border border-slate-100 dark:border-white/5 w-fit shadow-sm">
          <button 
            onClick={() => setActiveTab('verifications')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'verifications' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            Verifications
          </button>
          <button 
            onClick={() => setActiveTab('upgrades')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'upgrades' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            Authority Upgrades
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'users' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            User Network
          </button>
          {isSuper && (
            <button 
              onClick={() => setActiveTab('admins')}
              className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'admins' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
            >
              System Ops
            </button>
          )}
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === 'analytics' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-blue-600'}`}
          >
            Intelligence
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'verifications' && (
            <VerificationTab 
              experts={experts}
              verifiedExperts={verifiedExperts}
              seeding={seeding}
              handleSeed={handleSeed}
              setSelectedExpert={setSelectedExpert}
              handleUnverify={handleUnverify}
            />
          )}
          {activeTab === 'upgrades' && (
            <TierUpgradeTab 
              upgrades={tierUpgrades}
              onView={setSelectedExpert}
              onApprove={handleApproveUpgrade}
              onReject={handleRejectUpgrade}
            />
          )}
          {activeTab === 'users' && (
            <UsersTab 
              users={users}
              onEdit={setSelectedUser}
              onToggleBlock={handleToggleBlock}
            />
          )}
          {activeTab === 'admins' && isSuper && (
            <AdminGridTab 
              admins={admins}
              setShowAddAdmin={setShowAddAdmin}
            />
          )}
          {activeTab === 'analytics' && (
            <AnalyticsTab 
              analytics={analytics}
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

      {/* User Edit Modal */}
      <UserEditModal 
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdate={handleUpdateUser}
      />

      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm ? () => {
          modalConfig.onConfirm?.();
          setModalConfig(prev => ({ ...prev, isOpen: false }));
        } : undefined}
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
