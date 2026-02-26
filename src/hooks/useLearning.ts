import { useState, useEffect } from 'react';
import { getLearningPaths, getRecommendedPaths, LearningPath } from '@/services/learningService';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export function useLearning() {
  const [allPaths, setAllPaths] = useState<LearningPath[]>([]);
  const [recommendedPaths, setRecommendedPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [offlinePaths, setOfflinePaths] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [paths, recommended] = await Promise.all([
        getLearningPaths(),
        getRecommendedPaths()
      ]);
      setAllPaths(paths);
      setRecommendedPaths(recommended);
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, () => {
      loadData();
    });

    // Check local storage for offline paths
    if (typeof window !== 'undefined') {
      const offline = Object.keys(localStorage).filter(k => k.startsWith('learning-path-')).map(k => k.replace('learning-path-', ''));
      setOfflinePaths(offline);
    }

    return () => unsubscribe();
  }, []);

  return { allPaths, recommendedPaths, loading, offlinePaths };
}
