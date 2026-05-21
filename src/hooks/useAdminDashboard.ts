import { useState, useEffect } from 'react';
import { useRouter } from '@/i18n/routing';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { userService } from '@/services/userService';
import { UserProfile } from '@/types';
import { useAdminCreation } from './admin/useAdminCreation';

export function useAdminDashboard() {
  const router = useRouter();
  const { isLoading, isSuper } = useAdminAuth();
  const [experts, setExperts] = useState<UserProfile[]>([]);
  const [verifiedExperts, setVerifiedExperts] = useState<UserProfile[]>([]);
  const [tierUpgrades, setTierUpgrades] = useState<UserProfile[]>([]);
  const [admins, setAdmins] = useState<UserProfile[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<UserProfile | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [activeTab, setActiveTab] = useState<'verifications' | 'upgrades' | 'admins' | 'users' | 'analytics'>('verifications');
  
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean; title: string; description: string; type: 'success' | 'warning' | 'info'; onConfirm?: () => void; }>({ isOpen: false, title: '', description: '', type: 'info' });
  const [confirmConfig, setConfirmConfig] = useState<{ isOpen: boolean; title: string; description: string; onConfirm: () => void; }>({ isOpen: false, title: '', description: '', onConfirm: () => {} });

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info', onConfirm?: () => void) => setModalConfig({ isOpen: true, title, description, type, onConfirm });
  const showConfirm = (title: string, description: string, onConfirm: () => void) => setConfirmConfig({ isOpen: true, title, description, onConfirm });

  const adminCreation = useAdminCreation(showAlert, async () => {
    const adminsData = await userService.getAdmins();
    setAdmins(adminsData);
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expertsData, verifiedData, upgradesData, adminsData, usersData, analyticsData] = await Promise.all([
          userService.getPendingExperts(),
          userService.getVerifiedExperts(),
          userService.getTierUpgrades(),
          isSuper ? userService.getAdmins() : Promise.resolve([]),
          fetch('/api/admin/users/list').then(res => res.ok ? res.json() : []),
          fetch('/api/admin/analytics/overview').then(res => res.ok ? res.json() : null)
        ]);
        
        setExperts(Array.isArray(expertsData) ? expertsData : []);
        setVerifiedExperts(Array.isArray(verifiedData) ? verifiedData : []);
        setTierUpgrades(Array.isArray(upgradesData) ? upgradesData : []);
        setAdmins(Array.isArray(adminsData) ? adminsData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setAnalytics(analyticsData);
      } catch (err) { 
        console.error("Fetch data error:", err); 
      } finally { 
        setLoading(false); 
      }
    };
    if (!isLoading) fetchData();
  }, [isLoading, isSuper]);

  const handleVerify = async (id: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expertId: id, status: 'verified' }) });
      if (!res.ok) throw new Error('Failed to verify');
      const verifiedOne = experts.find(e => e.uid === id);
      setExperts(prev => prev.filter(e => e.uid !== id));
      if (verifiedOne) setVerifiedExperts(prev => [{...verifiedOne, verificationStatus: 'verified'}, ...prev]);
      showAlert('Expert Verified', 'Expert application has been successfully verified.', 'success', () => setSelectedExpert(null));
    } catch (err) { showAlert('Verification Failed', 'Failed to verify expert application.', 'warning'); }
  };

  const handleReject = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expertId: id, status: 'rejected', notes: reason }) });
      if (!res.ok) throw new Error('Failed to reject');
      setExperts(prev => prev.filter(e => e.uid !== id));
      setVerifiedExperts(prev => prev.filter(e => e.uid !== id));
      showAlert('Application Rejected', 'Expert application has been rejected.', 'info', () => setSelectedExpert(null));
    } catch (err) { showAlert('Rejection Failed', 'Failed to reject application.', 'warning'); }
  };

  const handleUnverify = async (id: string) => {
    showConfirm('Revoke Verification', 'This will unverify the expert. Continue?', async () => {
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      try {
        const res = await fetch('/api/admin/expert/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expertId: id, status: 'unverified', notes: 'Manually unverified by admin' }) });
        if (!res.ok) throw new Error('Failed to unverify');
        setVerifiedExperts(prev => prev.filter(e => e.uid !== id));
        showAlert('Verification Revoked', 'Expert has been unverified.', 'success');
      } catch (err) { showAlert('Action Failed', 'Failed to unverify expert.', 'warning'); }
    });
  };

  const handleApproveUpgrade = async (id: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expertId: id, status: 'approved_upgrade' }) });
      if (!res.ok) throw new Error('Failed to approve upgrade');
      setTierUpgrades(prev => prev.filter(e => e.uid !== id));
      showAlert('Upgrade Approved', 'Credential upgrade approved. Expert has been notified to complete payment.', 'success');
    } catch (err) { showAlert('Error', 'Failed to approve upgrade.', 'warning'); }
  };

  const handleRejectUpgrade = async (id: string, reason: string) => {
    try {
      const res = await fetch('/api/admin/expert/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ expertId: id, status: 'rejected_upgrade', notes: reason }) });
      if (!res.ok) throw new Error('Failed to reject upgrade');
      setTierUpgrades(prev => prev.filter(e => e.uid !== id));
      showAlert('Upgrade Rejected', 'Expert upgrade request has been rejected.', 'info');
    } catch (err) { showAlert('Error', 'Failed to reject upgrade.', 'warning'); }
  };

  const handleLogout = () => { 
    sessionStorage.removeItem('isAdminAuthenticated'); 
    document.cookie = 'is_super_admin=; Max-Age=0; path=/'; 
    // Try router redirect first, fallback to hard reload if it fails
    try {
      router.push('/');
      setTimeout(() => {
        if (window.location.pathname.includes('/admin/dashboard')) {
          window.location.href = '/';
        }
      }, 500);
    } catch (e) {
      window.location.href = '/';
    }
  };

  const handleSeed = async () => {
    showConfirm('System Seeding', 'This will inject sample data. Continue?', async () => {
      setConfirmConfig(prev => ({ ...prev, isOpen: false }));
      setSeeding(true);
      try {
        const res = await fetch('/api/admin/seed', { method: 'POST' });
        if (res.ok) showAlert('Success', 'Database seeded successfully!', 'success');
        else showAlert('Error', 'Failed to seed database.', 'warning');
      } catch (err) { showAlert('Error', 'An error occurred while seeding database.', 'warning'); } finally { setSeeding(false); }
    });
  };

  const handleUpdateUser = async (userId: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/users/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, updates }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || 'Update failed'); }
      setUsers(prev => prev.map(u => u.uid === userId ? { ...u, ...updates } : u));
      setSelectedUser(null);
      showAlert('User Updated', 'User profile has been successfully modified.', 'success');
    } catch (err: any) { showAlert('Update Failed', err.message || 'Failed to modify user.', 'warning'); }
  };

  const handleToggleBlock = async (user: UserProfile) => {
    const nextStatus = !user.isBanned;
    showConfirm(
      nextStatus ? 'Block Node' : 'Unblock Node',
      `Are you sure you want to ${nextStatus ? 'block' : 'unblock'} access for ${user.fullName || 'this node'}?`,
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        try {
          await handleUpdateUser(user.uid, { isBanned: nextStatus });
        } catch (err) {
          console.error(err);
        }
      }
    );
  };

  return {
    isLoading, isSuper, experts, verifiedExperts, tierUpgrades, admins, users, analytics, loading, selectedExpert, setSelectedExpert, selectedUser, setSelectedUser, seeding, activeTab, setActiveTab,
    ...adminCreation, modalConfig, setModalConfig, confirmConfig, setConfirmConfig,
    handleVerify, handleReject, handleUnverify, handleApproveUpgrade, handleRejectUpgrade, handleLogout, handleSeed, handleUpdateUser, handleToggleBlock
  };
}
