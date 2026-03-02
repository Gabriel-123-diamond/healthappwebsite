export const offlineService = {
  /**
   * Caches data to localStorage with a timestamp
   */
  cacheData: (key: string, data: any) => {
    try {
      const payload = {
        timestamp: Date.now(),
        data
      };
      localStorage.setItem(`ikk_cache_${key}`, JSON.stringify(payload));
    } catch (e) {
      console.error("Cache failed:", e);
    }
  },

  /**
   * Retrieves cached data if it's within the TTL (default 24h)
   */
  getCachedData: (key: string, ttlHours: number = 24) => {
    try {
      const cached = localStorage.getItem(`ikk_cache_${key}`);
      if (!cached) return null;

      const payload = JSON.parse(cached);
      const ageHours = (Date.now() - payload.timestamp) / (1000 * 60 * 60);

      if (ageHours > ttlHours) {
        // Cache expired
        return null;
      }

      return payload.data;
    } catch (e) {
      return null;
    }
  }
};
