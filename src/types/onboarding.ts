import { UserRole } from './user';

export interface OnboardingData {
  referralCode: string;
  firstName: string;
  lastName: string;
  username: string;
  phone: string;
  countryCode: string;
  city: string;
  state: string;
  country: string;
  countryIso: string;
  stateIso: string;
  ageRange: string;
  dateOfBirth: string;
  role: UserRole;
  tier: any;
  vipTier: any;
  verificationLevel: number;
  interests: string[];
  chronicConditions: string[];
  familyHistory: string[];
  lifestyleGoals: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  gender?: string;
  pronouns?: string;
  timezone?: string;
  // Professional / Hospital Fields
  facilityName?: string;
  facilityType?: string;
  registrationNumber?: string;
  bedCapacity?: string;
  emergencyCoordinates?: string;
  address?: string;
  postalCode?: string;
  licenseNumber?: string;
  npiNumber?: string;
  issuingBoard?: string;
  graduationYear?: string;
  specialties?: string[];
  modalities?: string[];
  languages?: string[];
  insurances?: string[];
  consultationFee?: string;
  telehealthPreference?: boolean;
  practiceName?: string;
  certifications?: string[];
  yearsOfExperience?: string;
  willTravel?: boolean;
  herbalProducts?: string[];
  inventory?: string[];
  workshopCapabilities?: boolean;
  kyc: {
    idNumber: string;
    idCardUrl: string;
    selfieUrl: string;
    passportPhotoUrl: string;
    dob: string;
    address: string;
  };
}

export type ValidationState = "idle" | "checking" | "available" | "taken" | "invalid";
export type ReferralValidationState = "idle" | "validating" | "valid" | "invalid";

export interface OnboardingValidationStatus {
  username: ValidationState;
  phone: ValidationState;
  name: ValidationState;
  licenseNumber: ValidationState;
  idNumber: ValidationState;
  referral: ReferralValidationState;
  referralError: string;
}

export const initialOnboardingData: OnboardingData = {
  referralCode: "",
  firstName: "",
  lastName: "",
  username: "",
  phone: "",
  countryCode: "",
  city: "",
  state: "",
  country: "",
  countryIso: "",
  stateIso: "",
  ageRange: "",
  dateOfBirth: "",
  role: "user",
  tier: "basic",
  vipTier: "basic",
  verificationLevel: 1,
  interests: [],
  chronicConditions: [],
  familyHistory: [],
  lifestyleGoals: [],
  emailVerified: false,
  phoneVerified: false,
  gender: "",
  pronouns: "",
  timezone: "",
  facilityName: "",
  facilityType: "",
  registrationNumber: "",
  bedCapacity: "",
  emergencyCoordinates: "",
  address: "",
  postalCode: "",
  licenseNumber: "",
  npiNumber: "",
  issuingBoard: "",
  graduationYear: "",
  specialties: [],
  modalities: [],
  languages: [],
  insurances: [],
  consultationFee: "",
  telehealthPreference: false,
  practiceName: "",
  certifications: [],
  yearsOfExperience: "",
  willTravel: false,
  herbalProducts: [],
  inventory: [],
  workshopCapabilities: false,
  kyc: {
    idNumber: '',
    idCardUrl: '',
    selfieUrl: '',
    passportPhotoUrl: '',
    dob: '',
    address: '',
  },
};

