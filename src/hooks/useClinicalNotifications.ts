'use client';

import { useEffect, useState } from 'react';
import { notificationService, AppNotification } from '@/services/notificationService';
import { reminderService, MedicationReminder } from '@/services/reminderService';
import { auth } from '@/lib/firebase';

export function useClinicalNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // 1. Listen for Firestore notifications (Expert Q&A, System)
    const unsubscribe = notificationService.getNotifications((data) => {
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
      
      // Trigger Browser Notification for new unread ones
      const latest = data[0];
      if (latest && !latest.read && 'Notification' in window && Notification.permission === 'granted') {
        new Notification(latest.title, { body: latest.message });
      }
    });

    // 2. Local Polling for Medication Reminders
    const reminderInterval = setInterval(async () => {
      const reminders = await reminderService.getReminders();
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

      reminders.forEach(reminder => {
        if (reminder.isActive && reminder.times.includes(currentTime)) {
          // Trigger alert for medication due now
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification("Medication Node Active", {
              body: `It is time for your dose of ${reminder.medicationName} (${reminder.dosage}).`,
              icon: '/logo.png'
            });
          }
        }
      });
    }, 60000); // Check every minute

    return () => {
      unsubscribe();
      clearInterval(reminderInterval);
    };
  }, []);

  const requestPermission = async () => {
    if ('Notification' in window) {
      await Notification.requestPermission();
    }
  };

  return {
    notifications,
    unreadCount,
    requestPermission,
    markAsRead: notificationService.markAsRead,
    deleteNotification: notificationService.deleteNotification
  };
}
