import { db, auth } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, orderBy, query, where, addDoc, serverTimestamp, Timestamp, limit, updateDoc, increment, onSnapshot } from 'firebase/firestore';

export interface CommunityPost {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  topic: string;
  type: string;
  timestamp: Date;
  likes: number;
  comments: number;
}

export interface CommunityAnswer {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  isExpert: boolean;
  timestamp: Date;
}

export const COMMUNITY_TOPICS = [
  'General',
  'Mental Wellness',
  'Women\'s Health',
  'Nutrition',
  'Herbal Traditions',
  'Chronic Care',
];

export const communityService = {
  async getPosts(topic?: string): Promise<CommunityPost[]> {
    try {
      let q = query(
        collection(db, 'community_posts'),
        orderBy('timestamp', 'desc'),
        limit(50)
      );

      if (topic && topic !== 'General') {
        q = query(q, where('topic', '==', topic));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as CommunityPost;
      });
    } catch (error) {
      console.error("Error fetching community posts:", error);
      return [];
    }
  },

  async getPostById(id: string): Promise<CommunityPost | undefined> {
    try {
      const docRef = doc(db, 'community_posts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          timestamp: (data.timestamp as Timestamp).toDate()
        } as CommunityPost;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching post by ID:", error);
      return undefined;
    }
  },

  // Real-time answers
  getAnswersStream(postId: string, callback: (answers: CommunityAnswer[]) => void) {
    const q = query(
      collection(db, 'community_posts', postId, 'answers'),
      orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const answers = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          isExpert: data.authorRole === 'doctor' || data.authorRole === 'herbal_practitioner',
          timestamp: (data.timestamp as Timestamp)?.toDate() || new Date()
        } as CommunityAnswer;
      });
      callback(answers);
    });
  },

  async addPost(content: string, authorName: string, authorRole: string, topic: string, type: string = 'post'): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to post");

    try {
      await addDoc(collection(db, 'community_posts'), {
        content,
        authorId: user.uid,
        authorName,
        authorRole,
        topic,
        type,
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0
      });
    } catch (error) {
      console.error("Error adding post:", error);
      throw error;
    }
  },

  async submitAnswer(postId: string, content: string, authorName: string, authorRole: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error("Must be logged in to answer");

    try {
      await addDoc(collection(db, 'community_posts', postId, 'answers'), {
        content,
        authorId: user.uid,
        authorName,
        authorRole,
        timestamp: serverTimestamp()
      });

      await updateDoc(doc(db, 'community_posts', postId), {
        comments: increment(1)
      });
    } catch (error) {
      console.error("Error adding answer:", error);
      throw error;
    }
  },

  async reportPost(postId: string, reason: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'reports'), {
        postId,
        reporterId: user.uid,
        reason,
        status: 'pending',
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error reporting post:", error);
    }
  },

  async toggleLike(postId: string, isLiked: boolean): Promise<void> {
    try {
      const postRef = doc(db, 'community_posts', postId);
      await updateDoc(postRef, {
        likes: increment(isLiked ? -1 : 1)
      });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  }
};
