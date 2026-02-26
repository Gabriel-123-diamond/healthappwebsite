import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, query, orderBy, limit, serverTimestamp, addDoc } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/lib/constants';
import { getUserSubcollection } from '@/lib/firestoreUtils';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  isCompleted?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  icon: string;
  progress: number;
  totalModules: number;
  modules: Module[];
}

export async function getLearningPaths(): Promise<LearningPath[]> {
  try {
    const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTIONS.LEARNING_PATHS));
    const paths = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LearningPath));

    if (auth.currentUser) {
      return await _hydrateWithUserProgress(paths);
    }
    return paths;
  } catch (error) {
    console.error("Error fetching learning paths:", error);
    return [];
  }
}

export async function getLearningPathById(id: string): Promise<LearningPath | undefined> {
  try {
    const docRef = doc(db, FIRESTORE_COLLECTIONS.LEARNING_PATHS, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const path = { id: docSnap.id, ...docSnap.data() } as LearningPath;
      if (auth.currentUser) {
        return (await _hydrateWithUserProgress([path]))[0];
      }
      return path;
    }
    return undefined;
  } catch (error) {
    console.error(`Error fetching learning path ${id}:`, error);
    return undefined;
  }
}

export async function getRecommendedPaths(): Promise<LearningPath[]> {
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
      console.error(
        `Permission Error in getRecommendedPaths: ${error.message}\n` +
        `Target path: users/${user.uid}/${FIRESTORE_COLLECTIONS.HISTORY}\n` +
        `Current UID: ${user.uid}\n` +
        `Check Firestore rules and App Check debug token in Chrome console.`
      );
    } else {
      console.error("Error fetching recommended paths:", error);
    }
    return [];
  }
}

export async function updateLessonProgress(pathId: string, moduleId: string, lessonId: string, isCompleted: boolean): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const progressRef = doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid, FIRESTORE_COLLECTIONS.LEARNING_PROGRESS, pathId);
    const progressSnap = await getDoc(progressRef);
    
    let completedLessons: string[] = [];
    if (progressSnap.exists()) {
      completedLessons = progressSnap.data().completedLessons || [];
    }

    const uniqueId = `${moduleId}:${lessonId}`;
    if (isCompleted) {
      if (!completedLessons.includes(uniqueId)) completedLessons.push(uniqueId);
    } else {
      completedLessons = completedLessons.filter(id => id !== uniqueId);
    }

    await setDoc(progressRef, { completedLessons, lastUpdated: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error("Error updating lesson progress:", error);
  }
}

async function _hydrateWithUserProgress(paths: LearningPath[]): Promise<LearningPath[]> {
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
      } catch (error) {
      console.error("Error hydrating progress:", error);
      return paths;
    }
  }
  
  export async function createLearningPath(path: Omit<LearningPath, 'id' | 'progress'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, FIRESTORE_COLLECTIONS.LEARNING_PATHS), {
        ...path,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating learning path:", error);
      throw error;
    }
  }