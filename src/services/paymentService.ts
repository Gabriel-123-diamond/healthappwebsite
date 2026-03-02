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
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
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
  }
};
