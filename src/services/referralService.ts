export const referralService = {
  // Mock function to generate a new referral code
  generateReferralCode: async (): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate random string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let suffix = '';
    for (let i = 0; i < 7; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `REF-${suffix}`;
  }
};
