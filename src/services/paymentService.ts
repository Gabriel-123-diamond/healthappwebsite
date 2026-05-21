import { db, auth } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

export interface Transaction {
  id: string;
  amount: number;
  type: string;
  timestamp: string;
  status: string;
  metadata: any;
  tier?: string;
}

export const paymentService = {
  /**
   * Fetches payment history for the current user
   */
  getUserTransactions: async (): Promise<Transaction[]> => {
    const user = auth.currentUser;
    if (!user) throw new Error("Authentication required");

    try {
      const q = query(
        collection(db, "payments"),
        where("uid", "==", user.uid),
        orderBy("timestamp", "desc")
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Transaction[];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  },

  /**
   * Initializes Paystack payment
   * In a real production app, this would call your backend to initialize 
   * and return a reference, but for this demo we use the Inline JS approach.
   */
  initializePayment: async (config: {
    email: string;
    amount: number;
    metadata?: any;
    onSuccess: (reference: any) => void;
    onClose: () => void;
  }) => {
    // Helper to check and load script
    const getPaystackPop = () => {
      // @ts-ignore
      return window.PaystackPop;
    };

    const loadScript = () => {
      return new Promise((resolve, reject) => {
        if (getPaystackPop()) {
          resolve(getPaystackPop());
          return;
        }

        // Check if script already exists in DOM
        const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
        if (existingScript) {
          existingScript.addEventListener('load', () => resolve(getPaystackPop()));
          existingScript.addEventListener('error', () => reject(new Error('Failed to load Paystack SDK')));
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://js.paystack.co/v1/inline.js';
        script.async = true;
        script.onload = () => resolve(getPaystackPop());
        script.onerror = () => reject(new Error('Failed to load Paystack SDK'));
        document.head.appendChild(script);
      });
    };

    try {
      const PaystackPop = await loadScript();
      
      if (!PaystackPop) {
        throw new Error('PaystackPop is undefined after loading');
      }

      // @ts-ignore
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: config.email,
        amount: config.amount * 100, // Paystack expects kobo/cents
        currency: 'NGN',
        ref: `IKK-${Math.floor(Math.random() * 1000000000 + 1)}`,
        metadata: config.metadata,
        callback: (response: any) => {
          config.onSuccess(response);
        },
        onClose: () => {
          config.onClose();
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Payment system error:", err);
      alert("Payment system is temporarily unavailable. Please check your connection and try again.");
      config.onClose();
    }
  },

  /**
   * Verifies the completed transaction against the Next.js API
   */
  verifyPayment: async (sessionId: string): Promise<{success: boolean; error?: string}> => {
    try {
      const response = await fetch(`/api/payment/verify?reference=${sessionId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || 'Payment verification failed' };
    } catch (error) {
      console.error("Verification error:", error);
      return { success: false, error: 'Network error during verification' };
    }
  },
}
