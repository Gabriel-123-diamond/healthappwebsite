import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, getDocs, limit,
  doc, serverTimestamp, where, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot
} from 'firebase/firestore';

import { COMMUNITY_TOPICS, CommunityPost, CommunityAnswer } from '@/types/community';
export { COMMUNITY_TOPICS } from '@/types/community';
export type { CommunityPost, CommunityAnswer };

export const communityService = {
  /**
   * Fetches posts for a specific topic.
   */
  getPosts: async (topicId: string): Promise<CommunityPost[]> => {
    const q = query(
      collection(db, 'community_posts'),
      where('topicId', '==', topicId.toLowerCase()),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        authorName: data.userName || data.authorName || 'Anonymous User',
        authorRole: data.userRole || data.authorRole || 'user',
        likes: Array.isArray(data.likes) ? data.likes : [],
        comments: data.comments || 0,
        topic: data.topic || topicId,
        type: data.type || 'discussion',
        timestamp: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      } as CommunityPost;
    });
  },

  /**
   * Submits a new post to a community topic.
   */
  createPost: async (topicId: string, content: string, overrideName?: string, overrideRole?: string, type: string = 'discussion') => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    let userName = overrideName;
    let userRole = overrideRole;

    if (!userName || !userRole) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      userName = userName || userData?.fullName || 'Anonymous User';
      userRole = userRole || userData?.role || 'user';
    }

    const postData = {
      topicId: topicId.toLowerCase(),
      topic: topicId,
      userId: user.uid,
      userName,
      userRole,
      content,
      likes: [],
      comments: 0,
      type,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'community_posts'), postData);
    return { 
      id: docRef.id, 
      ...postData,
      authorName: userName,
      authorRole: userRole,
      timestamp: new Date(),
    } as CommunityPost;
  },

  /**
   * Backward compatibility
   */
  addPost: async (content: string, authorName: string, authorRole: string, topicId: string, type: string) => {
    return communityService.createPost(topicId, content, authorName, authorRole, type);
  },

  /**
   * Likes/Unlikes a post.
   */
  toggleLike: async (postId: string, isLiked: boolean) => {
    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, 'community_posts', postId), {
      likes: isLiked ? arrayUnion(user.uid) : arrayRemove(user.uid)
    });
  },

  likePost: async (postId: string) => {
    return communityService.toggleLike(postId, true);
  },

  /**
   * Reports a post.
   */
  reportPost: async (postId: string, reason: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, 'reports'), {
      targetId: postId,
      targetType: 'post',
      reporterId: user.uid,
      reason,
      createdAt: serverTimestamp()
    });
  },

  /**
   * Fetches a single post by ID.
   */
  getPostById: async (postId: string): Promise<CommunityPost | null> => {
    const docRef = doc(db, 'community_posts', postId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return null;
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      authorName: data.userName || data.authorName || 'Anonymous User',
      authorRole: data.userRole || data.authorRole || 'user',
      likes: Array.isArray(data.likes) ? data.likes : [],
      comments: data.comments || 0,
      topic: data.topic || data.topicId,
      type: data.type || 'discussion',
      timestamp: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
    } as CommunityPost;
  },

  /**
   * Fetches answers for a specific post.
   */
  getAnswers: async (postId: string): Promise<CommunityAnswer[]> => {
    const q = query(
      collection(db, 'community_posts', postId, 'answers'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CommunityAnswer[];
  },

  /**
   * Streams answers for a specific post.
   */
  getAnswersStream: (postId: string, callback: (answers: CommunityAnswer[]) => void) => {
    const q = query(
      collection(db, 'community_posts', postId, 'answers'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const answers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CommunityAnswer[];
      callback(answers);
    });
  },

  /**
   * Submits an answer to a post.
   */
  submitAnswer: async (postId: string, content: string, overrideName?: string, overrideRole?: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    let userName = overrideName;
    let userRole = overrideRole;

    if (!userName || !userRole) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      userName = userName || userData?.fullName || 'Anonymous User';
      userRole = userRole || userData?.role || 'user';
    }

    const isExpert = userRole !== 'user';

    const answerData: Omit<CommunityAnswer, 'id'> = {
      postId,
      userId: user.uid,
      userName: userName!,
      userRole: userRole!,
      content,
      isExpert,
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'community_posts', postId, 'answers'), answerData);
    
    // Increment comment count on post
    try {
      const postRef = doc(db, 'community_posts', postId);
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        await updateDoc(postRef, {
          comments: (postDoc.data().comments || 0) + 1
        });
      }
    } catch (e) {
      console.error("Failed to update comment count", e);
    }

    return { id: docRef.id, ...answerData };
  }
};
