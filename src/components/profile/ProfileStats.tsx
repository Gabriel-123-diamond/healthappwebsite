'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { User } from 'firebase/auth';
import { UserProfile } from '@/types/user';
import { referralService, REWARD_POINTS } from '@/services/referralService';
import { exportDataAsJson, exportDataAsPdf } from '@/services/dataService';
import NiceModal from '@/components/common/NiceModal';
import { useCountdown } from '@/hooks/useCountdown';

// Extracted Sub-nodes
import { ProtocolStatusNode } from './stats/ProtocolStatusNode';
import { IntelPointsNode } from './stats/IntelPointsNode';
import { MeshLinkNode } from './stats/MeshLinkNode';
import { DataVaultNode } from './stats/DataVaultNode';

interface ProfileStatsProps {
  user: User;
  userProfile: UserProfile | null;
  referralCode: string;
  setReferralCode: (code: string) => void;
  t: any; // Kept for legacy if needed, but using hook now
}

export default function ProfileStats({ user, userProfile, referralCode, setReferralCode }: ProfileStatsProps) {
  const t = useTranslations('profile.stats');
  const [generating, setGenerating] = useState(false);
  const [processingExport, setProcessingExport] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const router = useRouter();

  // Evolution Rank & Points Logic
  const points = userProfile?.points || 0;
  const level = Math.floor(points / 500) + 1;
  const nextLevelProgress = ((points % 500) / 500) * 100;

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

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  const handleGenerate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    setGenerating(true);
    try {
      const username = userProfile?.username || user.displayName || 'USER';
      const newCode = await referralService.generateReferralCode(user.uid, username);
      setReferralCode(newCode);
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyCodeOnly = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (referralCode === '...' || referralCode === 'NO CODE') return;
    navigator.clipboard.writeText(referralCode);
    showAlert('Copied!', t('copyCode'), 'success');
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (referralCode === '...' || referralCode === 'NO CODE') return;
    const link = referralService.getReferralLink(referralCode);
    const shareData = {
      title: 'Join me on Ikiké Health AI',
      text: `Join me on Ikiké Health AI and let's discover holistic health together! Use my referral code: ${referralCode} to get ${REWARD_POINTS} bonus points.`,
      url: link,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(link);
      showAlert('Copied!', t('copyLink'), 'success');
    }
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const triggerExportJson = async () => {
    setExportModalOpen(false);
    setProcessingExport(true);
    try {
      await exportDataAsJson();
      showAlert('Export Complete', 'Your health data archive has been downloaded.', 'success');
    } catch (err: any) {
      console.error(err);
      showAlert('Export Failed', err.message || 'Failed to export JSON archive', 'warning');
    } finally {
      setProcessingExport(false);
    }
  };

  const triggerExportPdf = async () => {
    setExportModalOpen(false);
    setProcessingExport(true);
    try {
      await exportDataAsPdf();
      showAlert('Export Complete', 'Your Clinical Summary PDF has been generated.', 'success');
    } catch (err: any) {
      console.error(err);
      showAlert('Export Failed', err.message || 'Failed to generate PDF summary', 'warning');
    } finally {
      setProcessingExport(false);
    }
  };

  const timeLeft = useCountdown(
    userProfile?.tier && userProfile.tier !== 'basic' ? userProfile.subscriptionExpiry || null : null
  );

  const tierName = userProfile?.tier === 'vip2' || userProfile?.tier === 'premium' ? 'PREMIUM' : 
                  userProfile?.tier === 'vip1' ? 'PLUS' : 'BASIC';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        
        {/* Extracted Protocol Status Monitor */}
        <ProtocolStatusNode 
          tierName={tierName}
          timeLeft={timeLeft}
        />

        {/* Extracted Intel Points Monitor */}
        <IntelPointsNode 
          level={level}
          points={points}
          nextLevelProgress={nextLevelProgress}
          user={user}
        />

        {/* Extracted Mesh Link Monitor */}
        <MeshLinkNode 
          referralCode={referralCode}
          generating={generating}
          handleGenerate={handleGenerate}
          copyCodeOnly={copyCodeOnly}
          handleShare={handleShare}
        />

        {/* Extracted Data Vault Monitor */}
        <DataVaultNode 
          processingExport={processingExport}
          handleExport={handleExport}
        />
        
      </div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
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
