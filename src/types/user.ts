import { Expert } from './expert';

export type UserRole = 'user' | 'doctor' | 'wellness_practitioner' | 'hospital' | 'admin';

export const EXPERT_ROLES: UserRole[] = ['doctor', 'wellness_practitioner', 'hospital', 'admin'];

export const isExpertRole = (role: string | undefined | null): boolean => {
  if (!role) return false;
  return EXPERT_ROLES.includes(role as UserRole);
};

export const ONBOARDING_STEPS = [
  { number: 1, title: "Referral", id: 'start' },
  { number: 2, title: "Basic Identity", id: 'identity' },
  { number: 3, title: "Security Check", id: 'verification' },
  { number: 4, title: "Your Base", id: 'location' },
  { number: 5, title: "Interests", id: 'interests' }
] as const;

export interface PhoneEntry {
  number: string;
  code: string;
  label: string;
  isCustom?: boolean;
  isVerified?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  phone: string;
  phones?: PhoneEntry[];
  countryCode: string;
  city: string;
  state: string;
  country: string;
  countryIso: string;
  stateIso: string;
  ageRange: string;
  dateOfBirth?: string;
  role: UserRole;
  tier?: 'basic' | 'professional' | 'standard' | 'premium' | 'vip1' | 'vip2';
  verificationLevel?: number;
  vipTier?: string;
  interests: string[];
  points: number;
  onboardingComplete: boolean;
  onboardingStep: number;
  profileComplete: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  kycDocument?: string;
  kycDocType?: string;
  updatedAt: string;
  createdAt: string;
  
  // Expert fields (Quick Access for Directory)
  specialty?: string;
  customSpecialty?: string;
  specialties?: { name: string, years: string }[];
  yearsOfExperience?: string;
  licenseNumber?: string;
  institutionName?: string;
  bio?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  
  // Upgrade Lifecycle
  requestedTier?: 'basic' | 'professional' | 'standard' | 'premium';
  upgradeStatus?: 'idle' | 'pending_verification' | 'pending_payment' | 'rejected';
  upgradeNotes?: string;
  
  // Detailed expert profile
  expertProfile?: Expert;

  // Premium Features
  familyMembers?: string[]; // UIDs of family members
  familySlots?: number;     // Number of available slots (e.g., 4 for ELITE)
  vaultEnabled?: boolean;
  aiChatLimit?: number;     // Remaining AI chat limit for the current period
  aiChatUnlimited?: boolean; 
  subscriptionExpiry?: string; // ISO date string
  isBanned?: boolean;
}
