import { db, auth } from '@/lib/firebase';
import { getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/lib/constants';
import { getUserSubcollection } from '@/lib/firestoreUtils';
import { LearningPath } from '@/types/learning';

export async function hydrateWithUserProgress(paths: LearningPath[]): Promise<LearningPath[]> {
  const user = auth.currentUser;
  if (!user) return paths;

  try {
    const progressColl = getUserSubcollection(FIRESTORE_COLLECTIONS.LEARNING_PROGRESS);
    if (!progressColl) return paths;

    const progressSnap = await getDocs(progressColl);
    const progressMap = new Map(progressSnap.docs.map(doc => [doc.id, doc.data()]));

    return paths.map(path => {
      const progressData = progressMap.get(path.id);
      if (!progressData) return path;

      const completedLessons = (progressData.completedLessons as string[]) || [];
      let totalLessons = 0;
      let completedCount = 0;

      const updatedModules = path.modules.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => {
          totalLessons++;
          const isCompleted = completedLessons.includes(`${module.id}:${lesson.id}`);
          if (isCompleted) completedCount++;
          return { ...lesson, isCompleted };
        })
      }));

      const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

      return {
        ...path,
        modules: updatedModules,
        progress: percent
      };
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("hydrateWithUserProgress: Permission denied fetching user progress. This is likely an App Check local environment restriction. Defaulting to 0% progress.");
    } else {
      console.error("Error hydrating progress:", error);
    }
    return paths;
  }
}

export async function getRecommendedPaths(getLearningPaths: () => Promise<LearningPath[]>): Promise<LearningPath[]> {
  const user = auth.currentUser;
  if (!user) {
    console.debug("getRecommendedPaths: No user authenticated, returning empty.");
    return [];
  }

  try {
    // 1. Get Search History
    const historyRef = getUserSubcollection(FIRESTORE_COLLECTIONS.HISTORY);
    if (!historyRef) {
      console.warn("getRecommendedPaths: Could not get user subcollection reference.");
      return [];
    }

    const historySnap = await getDocs(query(historyRef, orderBy('timestamp', 'desc'), limit(10)));
    const searchTerms = historySnap.docs.map(doc => (doc.data().query as string || '').toLowerCase()).filter(Boolean);

    if (searchTerms.length === 0) {
      console.debug("getRecommendedPaths: No search history found for user.");
      return [];
    }

    // 2. Get All Paths
    const allPaths = await getLearningPaths();

    // 3. Filter
    return allPaths.filter(path => {
      const text = (path.title + ' ' + path.description).toLowerCase();
      return searchTerms.some(term => text.includes(term));
    });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn(
        `getRecommendedPaths: Permission denied. Returning empty recommendations.\n` +
        `Target path: users/${user.uid}/${FIRESTORE_COLLECTIONS.HISTORY}\n` +
        `Note: This is strictly an App Check enforcement issue on localhost, not a rules defect.`
      );
    } else {
      console.error("Error fetching recommended paths:", error);
    }
    return [];
  }
}
