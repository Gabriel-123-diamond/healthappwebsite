import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase";

export const requestNotificationPermission = async () => {
  if (typeof window === "undefined" || !("Notification" in window)) return;

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted" && messaging) {
      const token = await getToken(messaging, {
        vapidKey: "BF3kctuq2rmh9RZ8jeR6xAs6DTnWS_hf1N5CJfyTOscOL7WEgHnBIgrBJu6imFin-1TlEEiF-xvRFT04H86ijJk",
      });
      console.log("Web Push Token:", token);
      // In a real app, send this token to your server
      return token;
    }
  } catch (error) {
    console.error("Notification permission error:", error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
