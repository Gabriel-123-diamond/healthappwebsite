'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { deleteAccount, exportDataAsJson, exportDataAsPdf } from '@/services/dataService';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export function useProfileMenu() {
  const t = useTranslations('profile.menu');
  const [processing, setProcessing] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const router = useRouter();

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info' | 'upgrade';
    onConfirm?: () => void;
    confirmText?: string;
    isPopup?: boolean;
    features?: string[];
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info',
    isPopup: false,
    features: []
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

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' | 'upgrade' = 'info', onConfirm?: () => void, confirmText?: string, isPopup?: boolean, features?: string[]) => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type,
      onConfirm,
      confirmText,
      isPopup,
      features
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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleExport = () => {
    setExportModalOpen(true);
  };

  const triggerExportJson = async () => {
    setExportModalOpen(false);
    setExporting(true);
    try {
      await exportDataAsJson();
      showAlert('Export Complete', 'Your health data archive has been downloaded.', 'success');
    } catch (err: any) {
      console.error(err);
      showAlert('Export Failed', err.message || 'Failed to export JSON archive', 'warning');
    } finally {
      setExporting(false);
    }
  };

  const triggerExportPdf = async () => {
    setExportModalOpen(false);
    setExporting(true);
    try {
      await exportDataAsPdf();
      showAlert('Export Complete', 'Your Clinical Summary PDF has been generated.', 'success');
    } catch (err: any) {
      console.error(err);
      showAlert('Export Failed', err.message || 'Failed to generate PDF summary', 'warning');
    } finally {
      setExporting(false);
    }
  };

  const handleDelete = async () => {
    showConfirm(
      "Terminate Account",
      t('deleteConfirm') || "Are you sure you want to permanently delete your account and all associated health records? This action is irreversible.",
      async () => {
        setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        setProcessing(true);
        try {
          await deleteAccount();
          await signOut(auth);
          router.push('/');
        } catch (error) {
          console.error(error);
          showAlert('Error', 'Failed to delete account', 'warning');
        } finally {
          setProcessing(false);
        }
      }
    );
  };

  return {
    t,
    processing,
    exporting,
    exportModalOpen,
    setExportModalOpen,
    triggerExportJson,
    triggerExportPdf,
    modalConfig,
    setModalConfig,
    confirmConfig,
    setConfirmConfig,
    handleSignOut,
    handleExport,
    handleDelete,
    showAlert
  };
}
