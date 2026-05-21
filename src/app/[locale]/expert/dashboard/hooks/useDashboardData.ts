import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { userService } from '@/services/userService';
import { contentService } from '@/services/contentService';
import { appointmentService } from '@/services/appointmentService';
import { 
  getExpertAccessCodes, 
  generateAccessCode, 
  deleteAccessCode, 
  AccessCode,
  subscribeToExpertAccessCodes 
} from '@/services/accessCodeService';
import { useExpertDashboard } from '@/context/ExpertDashboardContext';

export function useDashboardData() {
  const { state, dispatch } = useExpertDashboard();
  const searchParams = useSearchParams();
  const { profile } = state;

  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && (['appointments', 'queue', 'articles', 'courses', 'kanban'] as const).includes(tab as any)) {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab as any });
    }
  }, [searchParams, dispatch]);

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
    let unsubscribeAccessCodes: (() => void) | undefined;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsubscribeAccessCodes = subscribeToExpertAccessCodes(user.uid, (codes) => {
          setAccessCodes(codes);
          setLoadingCodes(false);
        });
      } else {
        if (unsubscribeAccessCodes) unsubscribeAccessCodes();
        setAccessCodes([]);
        setLoadingCodes(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeAccessCodes) unsubscribeAccessCodes();
    };
  }, []);

  const refreshProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const profileData = await userService.getUserProfile(user.uid);
      dispatch({ type: 'SET_PROFILE', payload: profileData });
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Make token globally available for banners/modals
      user.getIdToken().then(token => {
        (window as any).firebaseAuthToken = token;
      });

      try {
        const [profileData, articlesData, coursesData] = await Promise.all([
          userService.getUserProfile(user.uid),
          contentService.getExpertArticles(user.uid),
          contentService.getExpertLearningPaths(user.uid)
        ]);

        appointmentService.getExpertAppointments(user.uid, (data) => {
          dispatch({ type: 'SET_APPOINTMENTS', payload: data });
        });

        dispatch({ type: 'SET_PROFILE', payload: profileData });
        dispatch({ type: 'SET_ARTICLES', payload: articlesData });
        dispatch({ type: 'SET_COURSES', payload: coursesData });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    });

    return () => unsubscribeAuth();
  }, [dispatch]);

  const handleGenerateCode = async (expiryHours: number = 24, usageLimit: number = 0) => {
    const user = auth.currentUser;
    if (!user) return;

    setIsGenerating(true);
    try {
      const expertName = profile?.displayName || profile?.name || user.email || 'Expert';
      await generateAccessCode(user.uid, expertName, expiryHours, usageLimit);
      showAlert('Code Generated', 'Your new access code is ready for distribution.', 'success');
    } catch (error) {
      console.error('Error generating code:', error);
      showAlert('Generation Failed', 'Could not create access code. Please try again.', 'warning');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
    showConfirm(
      'Revoke Access Code',
      'This will immediately invalidate this code. Continue?',
      async () => {
        try {
          await deleteAccessCode(codeId);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
          showAlert('Code Revoked', 'The access code has been permanently deleted.', 'success');
        } catch (error) {
          console.error('Error deleting code:', error);
          showAlert('Action Failed', 'Could not revoke access code.', 'warning');
        }
      }
    );
  };

  return {
    state,
    dispatch,
    accessCodes,
    loadingCodes,
    isGenerating,
    modalConfig,
    setModalConfig,
    confirmConfig,
    setConfirmConfig,
    handleGenerateCode,
    handleDeleteCode,
    showAlert,
    showConfirm,
    refreshProfile
  };
}
