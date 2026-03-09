import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { contentService } from '@/services/contentService';
import { appointmentService } from '@/services/appointmentService';
import { getExpertAccessCodes, generateAccessCode, deleteAccessCode, AccessCode } from '@/services/expertDashboardService';
import { useExpertDashboard } from '@/context/ExpertDashboardContext';

export function useDashboardData() {
  const { state, dispatch } = useExpertDashboard();
  const { profile } = state;

  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

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
    const fetchAccessCodes = async () => {
      const user = auth.currentUser;
      if (user) {
        const codes = await getExpertAccessCodes(user.uid);
        setAccessCodes(codes);
        setLoadingCodes(false);
      }
    };
    fetchAccessCodes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

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
    };

    fetchData();
  }, [dispatch]);

  const handleGenerateCode = async (expiryHours: number = 24, usageLimit: number = 0) => {
    const user = auth.currentUser;
    if (!user) {
      showAlert("Session Expired", "Session expired. Please sign in again.", "warning");
      return;
    }
    
    if (!profile) {
      showAlert("Expert Profile", "Expert profile not fully loaded. Please wait a moment.", "info");
      return;
    }

    setIsGenerating(true);
    try {
      await generateAccessCode(user.uid, profile.fullName || 'Expert', expiryHours, usageLimit);
      const updatedCodes = await getExpertAccessCodes(user.uid);
      setAccessCodes(updatedCodes);
    } catch (error: any) {
      console.error("Failed to generate code:", error);
      showAlert("Generation Failed", `Generation failed: ${error.message || 'Unknown error'}. Check your connection.`, "warning");
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    showConfirm(
      "Confirm Deletion",
      "Are you sure you want to delete this access node? It will immediately stop working for all users.",
      async () => {
        try {
          await deleteAccessCode(id);
          setAccessCodes(prev => prev.filter(c => c.id !== id));
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
          showAlert("Node Deleted", "The access node has been successfully removed.", "success");
        } catch (error: any) {
          console.error("Failed to delete code:", error);
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
          showAlert("Delete Failed", "Failed to delete code. Please try again.", "warning");
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
    showConfirm
  };
}
