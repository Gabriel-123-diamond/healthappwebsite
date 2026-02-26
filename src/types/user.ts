import { Expert } from './expert';

export type UserRole = 'user' | 'doctor' | 'herbal_practitioner' | 'hospital' | 'admin' | 'expert';

export const EXPERT_ROLES: UserRole[] = ['doctor', 'herbal_practitioner', 'hospital', 'expert'];

export const isExpertRole = (role: string): boolean => {
  return EXPERT_ROLES.includes(role as UserRole);
};

export const ONBOARDING_STEPS = [
  { number: 1, title: "Referral", id: 'referral' },
  { number: 2, title: "Identity", id: 'identity' },
  { number: 3, title: "Verification", id: 'verification' },
  { number: 4, title: "Professional Role", id: 'role' },
  { number: 5, title: "Expert Details", id: 'expert' },
  { number: 6, title: "Location", id: 'location' },
  { number: 7, title: "Interests", id: 'interests' }
] as const;

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  phone: string;
  countryCode: string;
  city: string;
  state: string;
  country: string;
  ageRange: string;
  dateOfBirth?: string;
  role: UserRole;
  interests: string[];
  points: number;
  onboardingComplete: boolean;
  onboardingStep: number;
  profileComplete: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  updatedAt: string;
  createdAt: string;
  
  // Expert fields (Quick Access for Directory)
  specialty?: string;
  specialties?: { name: string, years: string }[];
  yearsOfExperience?: string;
  licenseNumber?: string;
  institutionName?: string;
  bio?: string;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  
  // Detailed expert profile
  expertProfile?: Expert;
}
