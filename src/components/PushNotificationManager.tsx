'use client';

import { useEffect } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { app } from '@/lib/firebase';

export default function PushNotificationManager() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
            scope: '/',
          });
          const registration = await navigator.serviceWorker.ready;
          console.log('Service Worker ready:', registration.scope);

          if (!registration.pushManager) {
            console.warn('Push Manager not available in this browser/context.');
            return;
          }

          const messaging = getMessaging(app);
          
          // Request permission
          const permission = await Notification.requestPermission();
          if (permission === 'granted') {
            try {
              const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: registration,
              });
              if (token) {
                console.log('FCM Token:', token);
              }
            } catch (tokenError) {
              console.error('Error getting FCM token:', tokenError);
            }
          }
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      };

      registerServiceWorker();
    }
  }, []);

  return null; // This component doesn't render anything
}
