export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  imageUrl?: string;
  author: string;
  authorId: string; // Linked to expert UID
  date: string;
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
  tags: string[];
  status: 'draft' | 'published' | 'archived';
  isExpertVerified: boolean;
}
