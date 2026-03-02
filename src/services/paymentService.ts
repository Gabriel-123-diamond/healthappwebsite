import { auth } from "@/lib/firebase";

export const paymentService = {
  async createCheckoutSession(tier: 'professional' | 'standard' | 'premium') {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Unauthorized");

      const token = await user.getIdToken();
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tier })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment session");
      }

      const data = await response.json();
      return data; // URL to redirect to or session ID
    } catch (error) {
      console.error("Payment session error:", error);
      throw error;
    }
  },

  async verifyPayment(sessionId: string) {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Unauthorized");

      const token = await user.getIdToken();
      const response = await fetch(`/api/payment/verify?session_id=${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return await response.json();
    } catch (error) {
      console.error("Payment verification error:", error);
      throw error;
    }
  }
};
