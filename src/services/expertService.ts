import { db, auth } from '@/lib/firebase';
import { 
  collection, doc, getDoc, updateDoc, query, 
  where, getDocs, orderBy, limit, serverTimestamp 
} from 'firebase/firestore';

export interface ExpertStats {
  profileViews: number;
  searchAppearances: number;
  totalBookings: number;
  aiValidationScore: number; // 0-100 based on expert reviews
  engagementRate: number;
}

export interface EarningRecord {
  id?: string;
  amount: number;
  type: 'consultation' | 'referral' | 'bonus';
  status: 'pending' | 'cleared';
  createdAt: any;
}

export const expertService = {
  /**
   * Fetches the expert's clinical analytics nodes.
   */
  getDashboardStats: async (expertId: string): Promise<ExpertStats> => {
    const expertDoc = await getDoc(doc(db, 'experts', expertId));
    const data = expertDoc.data();

    return {
      profileViews: data?.stats?.profileViews || 0,
      searchAppearances: data?.stats?.searchAppearances || 0,
      totalBookings: data?.stats?.totalBookings || 0,
      aiValidationScore: data?.stats?.aiValidationScore || 85,
      engagementRate: data?.stats?.engagementRate || 0,
    };
  },

  /**
   * Fetches the earnings ledger for the expert.
   */
  getEarningsLedger: async (expertId: string): Promise<EarningRecord[]> => {
    const q = query(
      collection(db, 'earnings'),
      where('expertId', '==', expertId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as EarningRecord[];
  },

  /**
   * Updates expert professional details.
   */
  updateProfessionalProfile: async (expertId: string, updates: any) => {
    const expertRef = doc(db, 'experts', expertId);
    await updateDoc(expertRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};
