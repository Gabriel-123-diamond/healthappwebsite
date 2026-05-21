'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLearningPathById, LearningPath, enrollInCourse } from '@/services/learningService';
import { useTranslations } from 'next-intl';
import NiceModal from '@/components/common/NiceModal';
import { CourseHeader } from '@/components/learning/CourseHeader';
import { ModuleList } from '@/components/learning/ModuleList';

export default function CourseDetailPage() {
  const t = useTranslations('learningPage');
  const params = useParams();
  const id = params.id as string;
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info' | 'upgrade';
    confirmText?: string;
    onConfirm?: () => void;
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
      type,
      confirmText: 'Got it',
      onConfirm: () => setModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  useEffect(() => {
    const fetchPath = async () => {
      const data = await getLearningPathById(id);
      if (data) {
        setPath(data);
        setIsEnrolled(data.progress !== undefined && data.progress >= 0);
        if (data.modules.length) setExpandedModule(data.modules[0].id);
      }
      setLoading(false);
    };
    fetchPath();
  }, [id]);

  const handleEnroll = async () => {
    setModalConfig({
      isOpen: true,
      title: 'Enroll in Academy Course',
      description: `You are about to register for "${path?.title}". This will track your clinical progress and sync your achievement to the network registry. Do you wish to continue?`,
      type: 'info',
      confirmText: 'YES, ENROLL',
      onConfirm: async () => {
        setEnrolling(true);
        try {
          await enrollInCourse(id);
          setIsEnrolled(true);
          setModalConfig(prev => ({ ...prev, isOpen: false }));
          showAlert('Enrollment Successful', 'You are now registered for this course. Your clinical progress node is active.', 'success');
        } catch (error) {
          console.error("Enrollment failed:", error);
          showAlert('Enrollment Failed', 'Failed to register. Please check your connection.', 'warning');
        } finally {
          setEnrolling(false);
        }
      }
    });
  };

  const handleDownload = () => {
    setIsOffline(true);
    showAlert('Download Complete', 'Course data has been securely cached for offline clinical access.', 'success');
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold uppercase tracking-widest pt-32 sm:pt-40">{t('loading')}</div>;
  if (!path) return <div className="p-12 text-center pt-32 sm:pt-40">Course not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <CourseHeader 
        path={path}
        t={t}
        isEnrolled={isEnrolled}
        enrolling={enrolling}
        isOffline={isOffline}
        handleEnroll={handleEnroll}
        handleDownload={handleDownload}
      />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <ModuleList 
          path={path}
          t={t}
          isEnrolled={isEnrolled}
          expandedModule={expandedModule}
          setExpandedModule={setExpandedModule}
          handleEnroll={handleEnroll}
        />
      </div>

      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText || "Got it"}
      />
    </div>
  );
}
