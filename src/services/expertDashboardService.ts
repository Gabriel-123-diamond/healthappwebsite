export interface ExpertStats {
  totalViews: number;
  questionsAnswered: number;
  articlesPublished: number;
  rating: number;
}

export interface ExpertContent {
  id: string;
  title: string;
  type: 'Article' | 'Video';
  status: 'Published' | 'Draft' | 'Under Review';
  views: number;
  date: string;
}

const MOCK_STATS: ExpertStats = {
  totalViews: 12500,
  questionsAnswered: 45,
  articlesPublished: 8,
  rating: 4.8
};

const MOCK_CONTENT: ExpertContent[] = [
  { id: '1', title: 'Managing Diabetes with Diet', type: 'Article', status: 'Published', views: 5400, date: 'Jan 15, 2026' },
  { id: '2', title: 'Yoga for Back Pain', type: 'Video', status: 'Published', views: 3200, date: 'Jan 10, 2026' },
  { id: '3', title: 'Understanding Herbal Teas', type: 'Article', status: 'Draft', views: 0, date: 'Jan 26, 2026' },
];

export async function getExpertStats(): Promise<ExpertStats> {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_STATS), 500));
}

export async function getExpertContent(): Promise<ExpertContent[]> {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_CONTENT), 600));
}
