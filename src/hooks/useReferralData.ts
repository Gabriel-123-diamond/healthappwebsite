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
  const [code, setCode] = useState<string>('LOADING...');
  const [generating, setGenerating] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loadingReferrals, setLoadingReferrals] = useState(true);
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
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoadingReferrals(false);
        }
      } else {
        setCode('LOGIN REQUIRED');
        setLoadingReferrals(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadReferralData = async (uid: string) => {
    try {
      const existingCode = await referralService.getExistingReferralCode(uid);
      setCode(existingCode || 'NO CODE');
      
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
      setCode('ERROR');
      setLoadingReferrals(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const username = userProfile?.username || user.displayName || 'USER';
      const newCode = await referralService.generateReferralCode(user.uid, username);
      setCode(newCode);
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (code === 'LOADING...' || code === 'NO CODE' || code === 'LOGIN REQUIRED') return;
    navigator.clipboard.writeText(code);
    alert('Referral code copied!');
  };

  const copyLinkToClipboard = () => {
    if (code === 'LOADING...' || code === 'NO CODE' || code === 'LOGIN REQUIRED') return;
    const link = referralService.getReferralLink(code);
    navigator.clipboard.writeText(link);
    alert('Referral link copied!');
  };

  const referralLink = code !== 'LOADING...' && code !== 'NO CODE' && code !== 'LOGIN REQUIRED' 
    ? referralService.getReferralLink(code) 
    : '';

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
    code,
    referralLink,
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
    copyToClipboard,
    copyLinkToClipboard,
    user
  };
};
