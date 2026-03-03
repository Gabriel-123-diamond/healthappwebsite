import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * In a production app, notifications are usually sent from a server 
 * or Cloud Function when Firestore documents change.
 * 
 * This service provides a client-side bridge to trigger local 
 * notifications for UI feedback and demonstrates the logic.
 */
export const notificationTrigger = {
  /**
   * Triggers a notification to a specific user
   * (Simulated: In production this would send an FCM payload via backend)
   */
  async triggerLocalNotification(title: string, body: string) {
    if (typeof window === 'undefined') return;

    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
      });
    }
  },

  /**
   * Notifies a user about an appointment update
   */
  async notifyAppointmentUpdate(userId: string, status: string, expertName: string) {
    const title = status === 'confirmed' ? 'Appointment Confirmed! ✅' : 'Appointment Update';
    const body = status === 'confirmed' 
      ? `Your consultation with ${expertName} has been accepted.`
      : `There was an update to your appointment with ${expertName}.`;
    
    await this.triggerLocalNotification(title, body);
  },

  /**
   * Notifies about a new secure message
   */
  async notifyNewMessage(senderName: string, text: string) {
    await this.triggerLocalNotification(
      `New Message from ${senderName}`,
      text.length > 50 ? `${text.substring(0, 50)}...` : text
    );
  }
};
