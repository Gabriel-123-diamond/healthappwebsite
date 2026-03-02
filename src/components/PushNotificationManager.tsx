'use client';

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app, db, auth } from '@/lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function PushNotificationManager() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    const messaging = getMessaging(app);

    const saveToken = async (token: string, userId: string) => {
      try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          fcmToken: token,
          lastTokenUpdate: serverTimestamp(),
        });
      } catch (error) {
        console.error('Error saving FCM token to Firestore:', error);
      }
    };

    const registerAndGetToken = async (userId: string) => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: registration,
          });
          
          if (token) {
            await saveToken(token, userId);
          }
        }
      } catch (error) {
        console.error('FCM Registration failed:', error);
      }
    };

    // Handle Auth state to ensure token is linked to user
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        registerAndGetToken(user.uid);
      }
    });

    // Handle Foreground Messages
    const unsubscribeMessage = onMessage(messaging, (payload) => {
      console.log('Foreground message received:', payload);
      // You could use a toast library here or show a custom UI
      if (payload.notification) {
        new Notification(payload.notification.title || 'Ikiké Health AI', {
          body: payload.notification.body,
          icon: '/favicon.ico'
        });
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeMessage();
    };
  }, []);

  return null;
}
