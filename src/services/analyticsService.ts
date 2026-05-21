import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface AnalyticsData {
  profileViews: number;
  articleReads: number;
  courseEnrollments: number;
  averageRating: number;
  totalRatings: number;
  monthlyGrowth: {
    month: string;
    views: number;
    enrollments: number;
  }[];
  recentActivity: {
    id: string;
    type: 'read' | 'enrollment' | 'rating' | 'appointment';
    title: string;
    timestamp: string;
  }[];
}

export const analyticsService = {
  /**
   * Fetches comprehensive performance analytics for an expert.
   */
  getExpertAnalytics: async (expertId: string): Promise<AnalyticsData> => {
    // 1. Fetch basic stats from user profile
    const userRef = doc(db, 'users', expertId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    // 2. Fetch article stats
    const articlesQ = query(collection(db, 'articles'), where('authorId', '==', expertId));
    const articlesSnap = await getDocs(articlesQ);
    let totalReads = 0;
    articlesSnap.docs.forEach(doc => {
      totalReads += (doc.data().views || 0);
    });

    // 3. Fetch course stats
    const coursesQ = query(collection(db, 'learningPaths'), where('authorId', '==', expertId));
    const coursesSnap = await getDocs(coursesQ);
    let totalEnrollments = 0;
    coursesSnap.docs.forEach(doc => {
      totalEnrollments += (doc.data().enrollments || 0);
    });

    // 4. Calculate actual growth data
    const now = new Date();
    const months: string[] = [];
    const growthMap: Record<string, { views: number, enrollments: number }> = {};
    
    // Initialize last 5 months
    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = d.toLocaleString('en-US', { month: 'short' });
      months.push(mStr);
      growthMap[mStr] = { views: 0, enrollments: 0 };
    }

    // Since views are just accumulated, we'll assign them roughly to recent months or use creation dates
    articlesSnap.docs.forEach(doc => {
      const data = doc.data();
      const dateStr = data.createdAt || data.publishedAt;
      if (dateStr) {
        const d = new Date(dateStr);
        const mStr = d.toLocaleString('en-US', { month: 'short' });
        if (growthMap[mStr]) growthMap[mStr].views += (data.views || 0);
      } else {
        const currentMonth = months[4];
        growthMap[currentMonth].views += (data.views || 0);
      }
    });

    coursesSnap.docs.forEach(doc => {
      const data = doc.data();
      const dateStr = data.createdAt || data.publishedAt;
      if (dateStr) {
        const d = new Date(dateStr);
        const mStr = d.toLocaleString('en-US', { month: 'short' });
        if (growthMap[mStr]) growthMap[mStr].enrollments += (data.enrollments || 0);
      } else {
        const currentMonth = months[4];
        growthMap[currentMonth].enrollments += (data.enrollments || 0);
      }
    });

    const monthlyGrowth = months.map(mStr => ({
      month: mStr,
      views: growthMap[mStr].views,
      enrollments: growthMap[mStr].enrollments
    }));

    // 5. Fetch actual recent activity (Appointments)
    const aptsQ = query(
      collection(db, 'appointments'), 
      where('expertId', '==', expertId),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const aptsSnap = await getDocs(aptsQ);
    const recentActivity = aptsSnap.docs.map(doc => {
      const data = doc.data();
      const d = data.createdAt ? new Date(data.createdAt) : new Date();
      // Simple relative time formatter
      const diffHrs = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
      let timeStr = diffHrs < 1 ? 'Just now' : diffHrs < 24 ? `${diffHrs} hours ago` : `${Math.floor(diffHrs/24)} days ago`;

      return {
        id: doc.id,
        type: 'appointment' as const,
        title: `Appointment with User`,
        timestamp: timeStr
      };
    });

    return {
      profileViews: userData.views || 0,
      articleReads: totalReads,
      courseEnrollments: totalEnrollments,
      averageRating: userData.rating || 0,
      totalRatings: userData.reviewCount || 0,
      monthlyGrowth,
      recentActivity: recentActivity.length > 0 ? recentActivity : [] 
    };
  }
};
