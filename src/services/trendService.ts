import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';

export interface TrendItem {
  query: string;
  count: number;
  mode: string;
}

export const trendService = {
  /**
   * Fetches the most recent searches and aggregates them to find trends.
   * In a production app, this would be a pre-aggregated collection 
   * updated by a Cloud Function.
   */
  async getTrendingTopics(): Promise<TrendItem[]> {
    try {
      const q = query(
        collection(db, 'global_history'),
        orderBy('timestamp', 'desc'),
        limit(100) // Analyze last 100 searches
      );

      const snapshot = await getDocs(q);
      const counts: Record<string, { count: number, mode: string }> = {};

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const key = data.query.toLowerCase();
        if (counts[key]) {
          counts[key].count++;
        } else {
          counts[key] = { count: 1, mode: data.mode };
        }
      });

      return Object.entries(counts)
        .map(([query, data]) => ({
          query,
          count: data.count,
          mode: data.mode
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Return top 10
    } catch (error) {
      console.error("Error fetching trends:", error);
      return [];
    }
  }
};
