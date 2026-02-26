export interface Institution {
  id: string;
  name: string;
  type: 'Hospital' | 'University' | 'NGO' | 'Clinic';
  location: string;
  description: string;
  logoUrl?: string;
  coverUrl?: string;
  website?: string;
  verified: boolean;
  specialties: string[];
  stats: {
    experts: number;
    publications: number;
    followers: number;
  };
  library?: {
    id: string;
    title: string;
    description: string;
    isPremium: boolean;
    resources: {
      id: string;
      title: string;
      type: 'PDF' | 'Video' | 'Protocol';
      url: string;
    }[];
  }[];
}
