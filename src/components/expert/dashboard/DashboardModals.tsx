import React from 'react';
import { useRouter } from '@/i18n/routing';
import { CodeExpiryModal } from '@/components/expert/CodeExpiryModal';
import NiceModal from '@/components/common/NiceModal';

interface DashboardModalsProps {
  isExpiryModalOpen: boolean;
  setIsExpiryModalOpen: (open: boolean) => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  isGenerating: boolean;
  handleGenerateCode: (expiryHours?: number, usageLimit?: number) => Promise<void>;
  modalConfig: {
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  };
  setModalConfig: (config: any) => void;
  confirmConfig: {
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  };
  setConfirmConfig: (config: any) => void;
}

export const DashboardModals: React.FC<DashboardModalsProps> = ({
  isExpiryModalOpen,
  setIsExpiryModalOpen,
  isVerificationModalOpen,
  setIsVerificationModalOpen,
  isGenerating,
  handleGenerateCode,
  modalConfig,
  setModalConfig,
  confirmConfig,
  setConfirmConfig,
}) => {
  const router = useRouter();

  return (
    <>
      <CodeExpiryModal 
        isOpen={isExpiryModalOpen} 
        onClose={() => setIsExpiryModalOpen(false)} 
        onGenerate={handleGenerateCode} 
        isGenerating={isGenerating} 
      />

      <NiceModal 
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onConfirm={() => router.push('/expert/setup')}
        title="Stage 3 Verification Required"
        description="To maintain the clinical integrity of Ikiké, publishing articles and courses requires Stage 3 Verification. Please complete your professional credentialing to unlock these features."
        confirmText="Complete Verification"
        cancelText="Maybe Later"
        type="warning"
      />

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />

      <NiceModal
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        description={confirmConfig.description}
        confirmText="Confirm Deletion"
        cancelText="Cancel"
        type="warning"
      />
    </>
  );
};
