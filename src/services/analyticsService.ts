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
    type: 'read' | 'enrollment' | 'rating';
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
    const coursesQ = query(collection(db, 'learning_paths'), where('authorId', '==', expertId));
    const coursesSnap = await getDocs(coursesQ);
    let totalEnrollments = 0;
    coursesSnap.docs.forEach(doc => {
      totalEnrollments += (doc.data().enrollments || 0);
    });

    // Mocking some growth data for visualization
    const monthlyGrowth = [
      { month: 'Oct', views: 400, enrollments: 12 },
      { month: 'Nov', views: 600, enrollments: 18 },
      { month: 'Dec', views: 800, enrollments: 25 },
      { month: 'Jan', views: 1100, enrollments: 32 },
      { month: 'Feb', views: 1250, enrollments: 45 },
    ];

    return {
      profileViews: userData.views || 0,
      articleReads: totalReads,
      courseEnrollments: totalEnrollments,
      averageRating: userData.rating || 0,
      totalRatings: userData.reviewCount || 0,
      monthlyGrowth,
      recentActivity: [
        { id: '1', type: 'read', title: 'Managing Diabetes with Diet', timestamp: '2 hours ago' },
        { id: '2', type: 'enrollment', title: 'Herbal Remedies 101', timestamp: '5 hours ago' },
        { id: '3', type: 'rating', title: '5-star rating from John D.', timestamp: '1 day ago' },
      ]
    };
  }
};
