import { db, auth } from '@/lib/firebase';
import { 
  collection, addDoc, query, orderBy, getDocs, limit,
  doc, deleteDoc, updateDoc, serverTimestamp, where, onSnapshot 
} from 'firebase/firestore';

export interface AppNotification {
  id?: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'qa' | 'system';
  read: boolean;
  link?: string;
  createdAt: any;
}

export const notificationService = {
  /**
   * Fetches user notifications.
   */
  getNotifications: (callback: (notifications: AppNotification[]) => void) => {
    const user = auth.currentUser;
    if (!user) return () => {};

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppNotification[];
      callback(notifications);
    });
  },

  /**
   * Marks a notification as read.
   */
  markAsRead: async (id: string) => {
    await updateDoc(doc(db, 'notifications', id), { read: true });
  },

  /**
   * Deletes a notification.
   */
  deleteNotification: async (id: string) => {
    await deleteDoc(doc(db, 'notifications', id));
  },

  /**
   * Internal helper to trigger a notification (usually called by Cloud Functions, 
   * but implemented here for direct node-to-node alerts).
   */
  triggerNotification: async (userId: string, title: string, message: string, type: AppNotification['type'], link?: string) => {
    await addDoc(collection(db, 'notifications'), {
      userId,
      title,
      message,
      type,
      read: false,
      link,
      createdAt: serverTimestamp()
    });

    // Trigger FCM Push Payload via Next.js API
    try {
      await fetch('/api/notifications/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userIds: [userId],
          title,
          body: message
        })
      });
    } catch (error) {
      console.error('Failed to trigger Push Notification API:', error);
    }
  }
};
