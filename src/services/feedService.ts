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

const FEED_DATA = {
  en: [
    {
      id: '1',
      title: 'New Study: The Effects of Turmeric on Inflammation',
      excerpt: 'A randomized control trial shows promising results for curcumin supplements in reducing joint pain.',
      type: 'article',
      category: 'Herbal',
      source: 'Journal of Natural Medicine',
      date: 'Jan 24, 2026',
      isVerified: true,
      link: '/article/1',
      evidenceGrade: 'B'
    },
    {
      id: '2',
      title: 'Understanding Type 2 Diabetes Management',
      excerpt: 'Dr. Sarah Smith explains the latest guidelines on diet and medication for T2D.',
      type: 'video',
      category: 'Medical',
      source: 'HealthAI Network',
      date: 'Jan 23, 2026',
      isVerified: true,
      link: '#',
      evidenceGrade: 'A'
    },
    {
      id: '3',
      title: '5 Minute Morning Yoga Routine',
      excerpt: 'Start your day with these simple stretches to improve circulation and reduce stress.',
      type: 'video',
      category: 'Lifestyle',
      source: 'Wellness Daily',
      date: 'Jan 22, 2026',
      isVerified: false,
      link: '#',
      evidenceGrade: 'C'
    },
    {
      id: '4',
      title: 'Antibiotic Resistance: What You Need to Know',
      excerpt: 'Why overuse of antibiotics is a global health threat and how to prevent it.',
      type: 'article',
      category: 'Medical',
      source: 'World Health Org',
      date: 'Jan 20, 2026',
      isVerified: true,
      link: '/article/2',
      evidenceGrade: 'A'
    }
  ],
  es: [
    {
      id: '1',
      title: 'Nuevo Estudio: Efectos de la Cúrcuma en la Inflamación',
      excerpt: 'Un ensayo controlado aleatorio muestra resultados prometedores para los suplementos de curcumina en la reducción del dolor articular.',
      type: 'article',
      category: 'Herbal',
      source: 'Journal of Natural Medicine',
      date: '24 Ene 2026',
      isVerified: true,
      link: '/article/1',
      evidenceGrade: 'B'
    },
    {
      id: '2',
      title: 'Entendiendo el Manejo de la Diabetes Tipo 2',
      excerpt: 'La Dra. Sarah Smith explica las últimas pautas sobre dieta y medicación para la DT2.',
      type: 'video',
      category: 'Medical',
      source: 'Red HealthAI',
      date: '23 Ene 2026',
      isVerified: true,
      link: '#',
      evidenceGrade: 'A'
    },
    {
      id: '3',
      title: 'Rutina de Yoga Matutina de 5 Minutos',
      excerpt: 'Comienza tu día con estos estiramientos simples para mejorar la circulación y reducir el estrés.',
      type: 'video',
      category: 'Lifestyle',
      source: 'Wellness Daily',
      date: '22 Ene 2026',
      isVerified: false,
      link: '#',
      evidenceGrade: 'C'
    },
    {
      id: '4',
      title: 'Resistencia a los Antibióticos: Lo que Necesitas Saber',
      excerpt: 'Por qué el uso excesivo de antibióticos es una amenaza para la salud mundial y cómo prevenirlo.',
      type: 'article',
      category: 'Medical',
      source: 'Org. Mundial de la Salud',
      date: '20 Ene 2026',
      isVerified: true,
      link: '/article/2',
      evidenceGrade: 'A'
    }
  ],
  fr: [
    {
      id: '1',
      title: 'Nouvelle Étude : Les Effets du Curcuma sur l\'Inflammation',
      excerpt: 'Un essai contrôlé randomisé montre des résultats prometteurs pour les suppléments de curcumine dans la réduction des douleurs articulaires.',
      type: 'article',
      category: 'Herbal',
      source: 'Journal of Natural Medicine',
      date: '24 Jan 2026',
      isVerified: true,
      link: '/article/1',
      evidenceGrade: 'B'
    },
    {
      id: '2',
      title: 'Comprendre la Gestion du Diabète de Type 2',
      excerpt: 'Dr. Sarah Smith explique les dernières directives sur l\'alimentation et les médicaments pour le DT2.',
      type: 'video',
      category: 'Medical',
      source: 'Réseau HealthAI',
      date: '23 Jan 2026',
      isVerified: true,
      link: '#',
      evidenceGrade: 'A'
    },
    {
      id: '3',
      title: 'Routine de Yoga Matinale de 5 Minutes',
      excerpt: 'Commencez votre journée avec ces étirements simples pour améliorer la circulation et réduire le stress.',
      type: 'video',
      category: 'Lifestyle',
      source: 'Wellness Daily',
      date: '22 Jan 2026',
      isVerified: false,
      link: '#',
      evidenceGrade: 'C'
    },
    {
      id: '4',
      title: 'Résistance aux Antibiotiques : Ce qu\'il Faut Savoir',
      excerpt: 'Pourquoi la surutilisation des antibiotiques est une menace mondiale pour la santé et comment la prévenir.',
      type: 'article',
      category: 'Medical',
      source: 'Org. Mondiale de la Santé',
      date: '20 Jan 2026',
      isVerified: true,
      link: '/article/2',
      evidenceGrade: 'A'
    }
  ]
};

export async function getFeedItems(locale: string = 'en'): Promise<FeedItem[]> {
  return new Promise((resolve) => {
    const items = (FEED_DATA as any)[locale] || FEED_DATA.en;
    setTimeout(() => resolve(items as FeedItem[]), 600);
  });
}