import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc, serverTimestamp, addDoc, updateDoc, increment } from 'firebase/firestore';
import { FIRESTORE_COLLECTIONS } from '@/lib/constants';
import { LearningPath, Module, Lesson } from '@/types/learning';
import { hydrateWithUserProgress, getRecommendedPaths as getRecommendedPathsUtil } from './learningServiceUtils';

export type { LearningPath, Module, Lesson };

export async function getLearningPaths(): Promise<LearningPath[]> {
  try {
    const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTIONS.LEARNING_PATHS));
    const paths = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as LearningPath));

    if (auth.currentUser) {
      return await hydrateWithUserProgress(paths);
    }
    return paths;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn("getLearningPaths: Permission denied. If on localhost, verify App Check is configured or disabled.");
    } else {
      console.error("Error fetching learning paths:", error);
    }
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
        return (await hydrateWithUserProgress([path]))[0];
      }
      return path;
    }
    return undefined;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn(`getLearningPathById: Permission denied for ${id}. Verify App Check on localhost.`);
    } else {
      console.error(`Error fetching learning path ${id}:`, error);
    }
    return undefined;
  }
}

export async function getRecommendedPaths(): Promise<LearningPath[]> {
  return getRecommendedPathsUtil(getLearningPaths);
}

export async function enrollInCourse(pathId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Auth required");

  try {
    const enrollmentId = `${user.uid}_${pathId}`;
    const enrollmentRef = doc(db, 'enrollments', enrollmentId);
    const enrollmentSnap = await getDoc(enrollmentRef);

    if (enrollmentSnap.exists()) return; // Already enrolled

    const courseRef = doc(db, FIRESTORE_COLLECTIONS.LEARNING_PATHS, pathId);
    
    // Create enrollment record
    await setDoc(enrollmentRef, {
      userId: user.uid,
      courseId: pathId,
      userName: user.displayName || 'Anonymous User',
      userEmail: user.email || 'N/A',
      progress: 0,
      completedLessons: [],
      enrolledAt: serverTimestamp(),
      lastUpdated: serverTimestamp()
    });

    // Create initial progress record
    const progressRef = doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid, FIRESTORE_COLLECTIONS.LEARNING_PROGRESS, pathId);
    await setDoc(progressRef, { 
      completedLessons: [], 
      lastUpdated: serverTimestamp() 
    });

    // Increment global counter
    await updateDoc(courseRef, {
      enrolledCount: increment(1)
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
}

export async function updateLessonProgress(pathId: string, moduleId: string, lessonId: string, isCompleted: boolean): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;

  try {
    const progressRef = doc(db, FIRESTORE_COLLECTIONS.USERS, user.uid, FIRESTORE_COLLECTIONS.LEARNING_PROGRESS, pathId);
    const progressSnap = await getDoc(progressRef);
    
    let completedLessons: string[] = [];
    const isNewEnrollment = !progressSnap.exists();

    if (progressSnap.exists()) {
      completedLessons = progressSnap.data().completedLessons || [];
    }

    const uniqueId = `${moduleId}:${lessonId}`;
    if (isCompleted) {
      if (!completedLessons.includes(uniqueId)) completedLessons.push(uniqueId);
    } else {
      completedLessons = completedLessons.filter(id => id !== uniqueId);
    }

    // 1. Update User's Personal Progress
    await setDoc(progressRef, { completedLessons, lastUpdated: serverTimestamp() }, { merge: true });

    // 2. Handle Global Enrollment and Statistics
    if (isCompleted) {
      const enrollmentId = `${user.uid}_${pathId}`;
      const enrollmentRef = doc(db, 'enrollments', enrollmentId);
      
      const courseRef = doc(db, FIRESTORE_COLLECTIONS.LEARNING_PATHS, pathId);
      const courseSnap = await getDoc(courseRef);
      let progressPercent = 0;
      
      if (courseSnap.exists()) {
        const courseData = courseSnap.data();
        const totalLessons = (courseData.modules || []).reduce((acc: number, m: any) => acc + (m.lessons || []).length, 0);
        progressPercent = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
      }

      if (isNewEnrollment) {
        // Create new enrollment record
        await setDoc(enrollmentRef, {
          userId: user.uid,
          courseId: pathId,
          userName: user.displayName || 'Anonymous User',
          progress: progressPercent,
          completedLessons,
          enrolledAt: serverTimestamp(),
          lastUpdated: serverTimestamp()
        });

        // Increment global counter on the course itself
        await updateDoc(courseRef, {
          enrolledCount: increment(1)
        });
      } else {
        // Update existing enrollment
        await updateDoc(enrollmentRef, {
          progress: progressPercent,
          completedLessons,
          lastUpdated: serverTimestamp()
        });
      }
    }
  } catch (error) {
    console.error("Error updating lesson progress:", error);
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
