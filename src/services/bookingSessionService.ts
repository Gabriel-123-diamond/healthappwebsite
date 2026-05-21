import { db } from "@/lib/firebase";
import { collection, addDoc, getDoc, doc, serverTimestamp, Timestamp } from "firebase/firestore";

export interface BookingSession {
  expertId: string;
  expertName: string;
  expiresAt: Timestamp;
  createdAt: any;
}

export const bookingSessionService = {
  /**
   * Creates a short-lived secure booking session
   * Expires in 15 minutes
   */
  async createSession(expertId: string, expertName: string): Promise<string> {
    const sessionData = {
      expertId,
      expertName,
      createdAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 15 * 60 * 1000)), // 15 mins
    };

    const docRef = await addDoc(collection(db, "booking_sessions"), sessionData);
    return docRef.id;
  },

  /**
   * Validates and retrieves a booking session
   */
  async getValidSession(sessionId: string): Promise<BookingSession | null> {
    try {
      const docRef = doc(db, "booking_sessions", sessionId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return null;

      const data = docSnap.data() as BookingSession;
      
      // Check expiry
      if (data.expiresAt.toMillis() < Date.now()) {
        return null;
      }

      return data;
    } catch (e) {
      console.error("Error fetching session:", e);
      return null;
    }
  }
};
