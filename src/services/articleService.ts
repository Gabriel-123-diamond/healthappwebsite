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

const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'The Role of Curcumin in Chronic Inflammation',
    summary: 'Extensive research highlights the potent anti-inflammatory properties of turmeric-derived curcumin.',
    content: `
      <h2>Introduction</h2>
      <p>Curcumin is the primary bioactive substance in turmeric. It has been used for centuries in traditional medicine and is now being extensively studied in modern clinical trials.</p>
      <h2>Clinical Evidence</h2>
      <p>A meta-analysis of randomized controlled trials suggests that curcumin supplementation can significantly reduce C-reactive protein levels, a marker of systemic inflammation.</p>
      <h2>Mechanism of Action</h2>
      <p>It works by inhibiting multiple molecules known to play major roles in inflammation, including NF-kB and various cytokines.</p>
      <h2>Conclusion</h2>
      <p>While highly effective, curcumin has low bioavailability. Consuming it with black pepper, which contains piperine, can increase absorption by up to 2,000%.</p>
    `,
    category: 'Herbal',
    author: 'Dr. Sarah Smith',
    date: 'Jan 24, 2026',
    evidenceGrade: 'A',
    tags: ['Inflammation', 'Turmeric', 'Nutrition']
  },
  {
    id: '2',
    title: 'Hypertension: Standard Medical Protocols',
    summary: 'A summary of the current guidelines for managing high blood pressure through medication and lifestyle.',
    content: `
      <h2>Guidelines 2026</h2>
      <p>The standard of care for hypertension remains a combination of pharmacological intervention and lifestyle modification.</p>
      <h2>First-Line Medications</h2>
      <p>Common first-line treatments include ACE inhibitors, ARBs, and calcium channel blockers.</p>
      <h2>Lifestyle Factors</h2>
      <p>Reducing sodium intake to less than 2,300mg per day and following the DASH diet are critical components of long-term management.</p>
    `,
    category: 'Medical',
    author: 'HealthAI Editorial Team',
    date: 'Jan 20, 2026',
    evidenceGrade: 'A',
    tags: ['Hypertension', 'Cardiology', 'Diet']
  }
];

export async function getArticles(): Promise<Article[]> {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_ARTICLES), 500));
}

export async function getArticleById(id: string): Promise<Article | undefined> {
  return new Promise(resolve => setTimeout(() => resolve(MOCK_ARTICLES.find(a => a.id === id)), 400));
}
