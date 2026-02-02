export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  imageUrl?: string;
  author: string;
  date: string;
  evidenceGrade: 'A' | 'B' | 'C' | 'D';
  tags: string[];
}
