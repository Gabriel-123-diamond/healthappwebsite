'use client';

import React from 'react';
import { 
  Shield, Trash2, LogOut, Users as UsersIcon, 
  Download, LayoutDashboard, Sparkles, Calendar, 
  MessageSquare, BookOpen, Loader2, CreditCard,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { isExpertRole, UserProfile } from '@/types/user';
import NiceModal from '@/components/common/NiceModal';
import { useProfileMenu } from '@/hooks/useProfileMenu';
import { ProfileMenuItem } from './ProfileMenuItem';
import { useRouter } from '@/i18n/routing';

import LanguageSelector from './LanguageSelector';
import AutoLogoutSelector from './AutoLogoutSelector';

interface ProfileMenuProps {
  userProfile: UserProfile | null;
}

export default function ProfileMenu({ userProfile }: ProfileMenuProps) {
  const router = useRouter();
  const {
    t, processing, exporting, exportModalOpen, setExportModalOpen,
    triggerExportJson, triggerExportPdf, modalConfig, setModalConfig,
    confirmConfig, setConfirmConfig,
    handleSignOut, handleExport, handleDelete
  } = useProfileMenu();
  
  const isExpert = isExpertRole(userProfile?.role || '');
  const tier = userProfile?.tier;
  const isPremium = tier === 'vip1' || tier === 'vip2' || tier === 'premium';

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-slate-900 rounded-[32px] sm:rounded-[48px] shadow-2xl dark:shadow-indigo-500/10 border border-slate-100 dark:border-white/5 overflow-hidden flex flex-col h-fit"
      >
        {!isPremium && (
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white">SETTINGS & OPTIONS</h3>
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          <div className="px-4 pt-4 md:pt-6">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Your Features</span>
            <div className="grid grid-cols-2 gap-3 mt-3 px-2">
              {userProfile?.role === 'admin' && (
                <div className="col-span-2">
                  <ProfileMenuItem 
                    href="/admin/dashboard" 
                    icon={Shield} 
                    label="Admin Dashboard" 
                    variant="dark"
                  />
                </div>
              )}

              {isExpert && (
                <div className="col-span-2">
                  <ProfileMenuItem 
                    href={userProfile?.role === 'hospital' ? "/hospital/dashboard" : "/expert/dashboard"} 
                    icon={LayoutDashboard} 
                    label={userProfile?.role === 'hospital' ? "INSTITUTION CONSOLE" : "EXPERT CONTROLS"} 
                  />
                </div>
              )}

              {/* Verification & Upgrade Nodes */}
              {isExpert && (!userProfile?.verificationStatus || userProfile?.verificationStatus === 'unverified') && (
                <div className="col-span-2 lg:col-span-1">
                  <ProfileMenuItem 
                    href="/expert/setup" 
                    icon={Sparkles} 
                    label="Verify My License" 
                    subtitle="Action Required"
                    variant="primary"
                  />
                </div>
              )}

              {((isExpert && userProfile?.verificationStatus === 'verified' && (tier === 'basic' || !tier)) || 
                (!isExpert && (tier === 'basic' || !tier))) && (
                <div className="col-span-2 lg:col-span-1">
                  <ProfileMenuItem 
                    href={isExpert ? "/expert/upgrade" : "/upgrade"} 
                    icon={Zap} 
                    label="Upgrade My Plan" 
                    subtitle="Unlock all features"
                    variant="primary"
                  />
                </div>
              )}

              <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1">
                <ProfileMenuItem 
                  href={isExpert ? "/expert/appointments" : "/appointments"} 
                  icon={Calendar} 
                  label="My Appointments" 
                />
              </div>

              {isPremium ? (
                <>
                  <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1 border-t border-slate-100 dark:border-white/5 pt-3 sm:border-t-0 sm:pt-0 pb-0">
                    <ProfileMenuItem href="/vault" icon={Shield} label="Medical Vault" subtitle="Safe Storage" />
                  </div>
                  <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1">
                    <ProfileMenuItem href="/journal" icon={BookOpen} label="Health Journal" subtitle="Track your health" />
                  </div>
                  <div className="col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1">
                    <ProfileMenuItem href="/qa" icon={MessageSquare} label="Expert Q&A" subtitle="Ask a specialist" />
                  </div>
                </>
              ) : (
                <>
                  <div className="col-span-2 border-t border-slate-100 dark:border-white/5 pt-3 sm:border-t-0 sm:pt-0">
                    <ProfileMenuItem 
                      icon={Shield} 
                      label="Medical Vault" 
                      subtitle="LOCKED" 
                      onClick={() => setModalConfig({
                        isOpen: true,
                        title: "Medical Vault Locked",
                        description: "The Medical Vault requires a Premium Plan for better security.",
                        type: 'upgrade',
                        isPopup: true,
                        features: ["Top-level security", "Access from anywhere"],
                        confirmText: "Upgrade My Plan",
                        onConfirm: () => {
                          setModalConfig(prev => ({ ...prev, isOpen: false }));
                          router.push('/upgrade');
                        }
                      })}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="px-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Tools & Settings</span>
            <div className="flex flex-col gap-3 mt-3 px-2">
              <LanguageSelector />
              <AutoLogoutSelector />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 mt-3 px-2">
              <div className="col-span-1">
                <ProfileMenuItem href="/transactions" icon={CreditCard} label="My Payments" />              </div>
              <div className="col-span-1">
                <ProfileMenuItem href="/referrals" icon={UsersIcon} label="Invite Friends" />
              </div>
              
              <div className="col-span-2">
                <ProfileMenuItem 
                  onClick={handleExport} 
                  icon={Download} 
                  label="Download My Info" 
                  isLoading={exporting}
                  rightElement={exporting ? <Loader2 size={16} className="animate-spin text-slate-400" /> : null}
                />
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-white/5 my-6 mx-6" />

          {/* Login & Security */}
          <div className="px-4 pb-6">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-3 block">Login & Security</span>
            <div className="grid grid-cols-2 gap-3 px-2">
              <div className="col-span-1">
                <ProfileMenuItem 
                  onClick={handleDelete} 
                  icon={Trash2} 
                  label="Delete My Account" 
                  variant="danger"
                  isLoading={processing}
                />
              </div>

              <div className="col-span-1">
                <ProfileMenuItem 
                  onClick={handleSignOut} 
                  icon={LogOut} 
                  label="Sign Out" 
                  variant="dark"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
        isPopup={modalConfig.isPopup}
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

      <NiceModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Port Health Records"
        description="Choose your preferred data format to download a secure snapshot of your clinical profile."
        confirmText="Download PDF Report"
        cancelText="Download JSON Archive"
        onConfirm={triggerExportPdf}
        onCancel={triggerExportJson}
        type="info"
      />
    </>
  );
}
