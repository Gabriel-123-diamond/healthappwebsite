export const paymentService = {
  /**
   * Initializes Paystack payment
   * In a real production app, this would call your backend to initialize 
   * and return a reference, but for this demo we use the Inline JS approach.
   */
  initializePayment: (config: {
    email: string;
    amount: number;
    metadata?: any;
    onSuccess: (reference: any) => void;
    onClose: () => void;
  }) => {
    // @ts-ignore
    const handler = window.PaystackPop.setup({
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
  },

  /**
   * Mock implementation for creating a checkout session (e.g., Stripe)
   */
  createCheckoutSession: async (tierId: 'pro' | 'premium'): Promise<{ url: string | null }> => {
    // In production, this would call your backend API to generate a Stripe/Paystack checkout URL
    console.log(`Initializing checkout for ${tierId}`);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url: `/onboarding/payment-success?session_id=mock_session_${Date.now()}&tier=${tierId}` });
      }, 1000);
    });
  },

  /**
   * Mock implementation for verifying a payment
   */
  verifyPayment: async (sessionId: string): Promise<{ success: boolean; error?: string }> => {
    // In production, this verifies the session with your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        if (sessionId.startsWith('mock_session_')) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: 'Invalid session ID' });
        }
      }, 1500);
    });
  }
};
