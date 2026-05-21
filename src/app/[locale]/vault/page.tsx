'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Loader2
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { vaultService, MedicalRecord } from '@/services/vaultService';
import { UserProfile } from '@/types/user';
import NiceModal from '@/components/common/NiceModal';
import { 
  VaultLockedState, EmptyVaultState, VaultHeader, VaultSearchAndStats, VaultRecordCard 
} from '@/components/vault/VaultComponents';
import { useTranslations } from 'next-intl';

export default function MedicalVaultPage() {
  const t = useTranslations('vault');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const targetUid = searchParams.get('uid');
  const targetName = searchParams.get('name');
  const isViewingOthers = !!targetUid;

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: '',
    description: '',
    type: 'success' as 'success' | 'warning'
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const userProfile = await userService.getUserProfile(user.uid);
        setProfile(userProfile);

        if (userProfile?.tier === 'vip1' || userProfile?.tier === 'vip2' || userProfile?.tier === 'premium') {
          const data = await vaultService.getRecords(targetUid || undefined);
          setRecords(data);
        }
      } catch (error) {
        console.error("Failed to fetch vault data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, targetUid]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const newRecord = await vaultService.uploadRecord(file, 'report');
      setRecords([newRecord as MedicalRecord, ...records]);
      setModalConfig({
        isOpen: true,
        title: t('recordSecured'),
        description: t('recordSecuredDesc', { name: file.name }),
        type: 'success'
      });
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        title: t('uploadFailed'),
        description: error.message || "Failed to secure document.",
        type: 'warning'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (recordId: string, url: string) => {
    try {
      await vaultService.deleteRecord(recordId, url);
      setRecords(records.filter(r => r.id !== recordId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const isPremium = profile?.tier === 'vip1' || profile?.tier === 'vip2' || profile?.tier === 'premium';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isPremium) {
    return <VaultLockedState />;
  }

  const filteredRecords = records.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-6xl auto px-4 relative z-10">
        <VaultHeader 
          isViewingOthers={isViewingOthers} 
          targetName={targetName} 
          uploading={uploading} 
          handleFileUpload={handleFileUpload} 
        />

        <VaultSearchAndStats 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          recordCount={records.length} 
        />

        {filteredRecords.length === 0 ? (
          <EmptyVaultState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredRecords.map((record) => (
                <VaultRecordCard 
                  key={record.id} 
                  record={record} 
                  isViewingOthers={isViewingOthers} 
                  onDelete={handleDelete}
                  onDownload={(r) => vaultService.downloadAndDecryptRecord(r)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </div>
  );
}
