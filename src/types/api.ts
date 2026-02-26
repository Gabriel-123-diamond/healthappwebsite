export interface SearchResult {
  id: string;
  title: string;
  summary: string;
  source: string;
  type: 'medical' | 'herbal';
  format: 'article' | 'video';
  link?: string;
  evidenceGrade?: 'A' | 'B' | 'C' | 'D';
}

export interface AIResponse {
  answer: string;
  results: SearchResult[];
  disclaimer: string;
  isEmergency?: boolean;
  emergencyData?: any;
  confidenceScore?: number;
  explanation?: string;
  regionalContext?: {
    region: string;
    insight: string;
  };
  directoryMatches?: {
    id: string;
    name: string;
    specialty: string;
    location: string;
  }[];
  totalDirectoryMatches?: number;
  reviews?: AIReview[];
}

export interface AIReview {
  id: string;
  queryId: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  status: 'verified' | 'flagged' | 'neutral';
  note: string;
  timestamp: Date;
}

export interface FeedItem {
  id: string;
  title: string;
  excerpt: string;
  type: 'article' | 'video';
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  imageUrl?: string;
  source: string;
  date: string;
  isVerified: boolean;
  link: string;
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
}
