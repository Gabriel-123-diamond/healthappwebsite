import { PhoneEntry } from './user';

export interface Expert {
  id: string;
  uid?: string; // Link to user
  name: string;
  email?: string;
  phoneNumber?: string;
  phones?: PhoneEntry[];
  type: 'doctor' | 'wellness_practitioner' | 'hospital' | 'other';
  specialty: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  
  facilityAddress?: string;
  facilityType?: string;

  // 1. Account Creation (Basic Info)
  country: string;
  state: string;
  
  // 2. Identity Verification (KYC)
  kyc: {
    idNumber?: string;
    idCardUrl: string;
    selfieUrl: string;
    passportPhotoUrl: string;
    dob: string;
    address: string;
  };

  // 3. Medical License Verification
  license: {
    licenseNumber: string;
    issuanceYear: string;
    expiryDate: string;
    practicingStatus: string;
    licenseCertUrl: string;
    annualLicenseUrl: string;
  };

  // 4. Education & Qualification
  education: Education[];

  // 5. Practice Information
  practice: {
    hospitalName: string;
    hospitalAddress: string;
    yearsExperience: string;
    consultationType: 'physical' | 'telemedicine' | 'both';
    hospitalIdUrl?: string;
  };

  // 6. Professional Profile
  bio: string;
  clinicalHistory?: string;
  portfolio?: PortfolioItem[];
  expertise: string[]; // Areas of expertise
  modalities?: string[];
  herbalProducts?: string[];
  inventory?: string[];
  consultationFee: string;
  availability: string; // Available Days & Time
  languages: string[];

  // 7. Legal & Compliance
  legal: {
    tosAccepted: boolean;
    privacyAccepted: boolean;
    telemedicineAccepted: boolean;
    conductAccepted: boolean;
    signature: string;
    timestamp: string;
  };

  // Online Presence (Legacy/Optional)
  socialLinks?: SocialLinks;
  
  // Search/Directory metadata
  location: string;
  rating: number;
  lat: number;
  lng: number;
  geohash: string;
  imageUrl?: string;
  updatedAt: string;
}

/**
 * Stripped-down version of Expert for public directory display.
 * Prevents accidental exposure of KYC/License documents.
 */
export interface PublicExpert {
  id: string;
  name: string;
  type: 'doctor' | 'wellness_practitioner' | 'hospital' | 'other';
  specialty: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  location: string;
  rating: number;
  lat: number;
  lng: number;
  email?: string;
  phone?: string;
  imageUrl?: string;
  bio?: string;
  clinicalHistory?: string;
  portfolio?: PortfolioItem[];
  expertise?: string[];
  modalities?: string[];
  herbalProducts?: string[];
  inventory?: string[];
  availability?: string;
  languages?: string[];
  updatedAt: string;
  isPrivate?: boolean;
  isMe?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  certUrl?: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description?: string;
}

export interface Certification {
  name: string;
  issuingOrganization: string;
  year: string;
  expiryDate?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface OfficeHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}
