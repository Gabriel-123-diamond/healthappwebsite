'use client';

import { useState, useEffect, useMemo } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { referralService, REWARD_POINTS } from '@/services/referralService';
import { Referral } from '@/types/referral';

const sortReferralsByDateDesc = (referrals: Referral[]) => {
  return referrals.sort((a, b) => {
    const timeA = a.createdAt?.seconds || 0;
    const timeB = b.createdAt?.seconds || 0;
    return timeB - timeA;
  });
};

export const useReferralData = () => {
  const [codes, setCodes] = useState<any[]>([]);
  const [generating, setGenerating] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);
  const [loadingCodes, setLoadingCodes] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [pointsFilter, setPointsFilter] = useState<number>(REWARD_POINTS); // Filter by max points

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const profileSnap = await getDoc(doc(db, 'users', currentUser.uid));
          if (profileSnap.exists()) {
            setUserProfile(profileSnap.data());
          }
          await loadReferralData(currentUser.uid);
          await loadCodes();
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoadingReferrals(false);
          setLoadingCodes(false);
        }
      } else {
        setCodes([]);
        setLoadingReferrals(false);
        setLoadingCodes(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadCodes = async () => {
    setLoadingCodes(true);
    try {
      const allCodes = await referralService.listReferralCodes();
      setCodes(allCodes);
    } catch (error) {
      console.error('Failed to load codes:', error);
    } finally {
      setLoadingCodes(false);
    }
  };

  const loadReferralData = async (uid: string) => {
    try {
      const unsub = referralService.getReferralTracker(
        uid, 
        (snapshot) => {
          const refs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Referral[];
          setReferrals(sortReferralsByDateDesc(refs));
          setLoadingReferrals(false);
        },
        (error) => {
          console.error('Failed to track referrals:', error);
          setLoadingReferrals(false);
        }
      );
      
      return unsub;
    } catch (error) {
      console.error('Failed to load referral data:', error);
      setLoadingReferrals(false);
    }
  };

  const handleGenerate = async (usageLimit?: number) => {
    if (!user) return;
    setGenerating(true);
    try {
      const username = userProfile?.username || user.displayName || 'USER';
      await referralService.generateReferralCode(user.uid, username, usageLimit);
      await loadCodes(); // Refresh codes list
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (codeToDelete: string) => {
    if (!user) return;
    try {
      await referralService.deleteReferralCode(codeToDelete);
      await loadCodes(); // Refresh codes list
    } catch (error) {
      console.error('Failed to delete code:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    if (!text || text === 'LOADING...' || text === 'NO CODE') return;
    navigator.clipboard.writeText(text);
    // You might want to use a toast here instead of alert
  };

  const copyLinkToClipboard = (text: string) => {
    if (!text || text === 'LOADING...' || text === 'NO CODE') return;
    const link = referralService.getReferralLink(text);
    navigator.clipboard.writeText(link);
  };

  const filteredReferrals = useMemo(() => {
    return referrals.filter(ref => {
      // 1. Status Filter
      if (statusFilter !== 'all' && ref.status !== statusFilter) return false;

      // 2. Date Filter
      if (ref.createdAt) {
        const refDate = ref.createdAt.toDate();
        if (startDate && refDate < new Date(startDate)) return false;
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (refDate > end) return false;
        }
      }

      // 3. Points Filter (Mock logic as points are currently static, but showing for future-proofing)
      const points = ref.status === 'completed' ? REWARD_POINTS : 0;
      if (points > pointsFilter) return false;

      return true;
    });
  }, [referrals, statusFilter, startDate, endDate, pointsFilter]);

  const totalPoints = referralService.calculateReferralPoints(referrals);
  const filteredPoints = referralService.calculateReferralPoints(filteredReferrals);

  return {
    codes,
    loadingCodes,
    generating,
    referrals: filteredReferrals,
    totalReferrals: referrals,
    loadingReferrals,
    referralPoints: totalPoints,
    filteredPoints,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    statusFilter,
    setStatusFilter,
    pointsFilter,
    setPointsFilter,
    handleGenerate,
    handleDelete,
    copyToClipboard,
    copyLinkToClipboard,
    user
  };
};
