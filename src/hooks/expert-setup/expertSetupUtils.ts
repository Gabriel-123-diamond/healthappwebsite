'use client';

export const expertSetupUtils = {
  isStepComplete: (stepNum: number, userProfile: any) => {
    if (!userProfile?.expertProfile) return false;
    const ep = userProfile.expertProfile;

    switch (stepNum) {
      case 2: // Identity
        return !!(ep.kyc?.idCardUrl && ep.kyc?.idNumber);
      case 4: // Medical Credentials
        return !!(ep.license?.licenseNumber && ep.license?.licenseCertUrl);
      case 5: // Education
        return ep.education && ep.education.length > 0 && !!ep.education[0].degree;
      case 6: // Practice
        return !!(ep.practice?.hospitalName && ep.practice?.yearsExperience);
      default:
        return false;
    }
  },

  getNextAvailableStep: (current: number, userProfile: any, direction: 'forward' | 'backward' = 'forward') => {
    let next = current + (direction === 'forward' ? 1 : -1);
    
    // Only skip if we are in an upgrade flow (already verified at some level)
    const isUpgrading = userProfile?.verificationStatus === 'verified';
    
    if (isUpgrading) {
      while (next > 1 && next < 8 && expertSetupUtils.isStepComplete(next, userProfile)) {
        next += (direction === 'forward' ? 1 : -1);
      }
    }
    
    return Math.max(1, Math.min(8, next));
  }
};
