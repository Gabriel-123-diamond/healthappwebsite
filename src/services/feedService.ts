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
      source: 'Ikiké Health AI Network',
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
      source: 'Red Ikiké Health AI',
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
      source: 'Réseau Ikiké Health AI',
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
  ],
  de: [
    {
      id: '1',
      title: 'Neue Studie: Die Wirkung von Kurkuma auf Entzündungen',
      excerpt: 'Eine randomisierte Kontrollstudie zeigt vielversprechende Ergebnisse für Curcumin-Ergänzungen bei der Linderung von Gelenkschmerzen.',
      type: 'article',
      category: 'Herbal',
      source: 'Journal für Naturmedizin',
      date: '24. Jan. 2026',
      isVerified: true,
      link: '/article/1',
      evidenceGrade: 'B'
    },
    {
      id: '2',
      title: 'Management von Typ-2-Diabetes verstehen',
      excerpt: 'Dr. Sarah Smith erklärt die neuesten Richtlinien zu Ernährung und Medikation bei T2D.',
      type: 'video',
      category: 'Medical',
      source: 'Ikiké Health AI Netzwerk',
      date: '23. Jan. 2026',
      isVerified: true,
      link: '#',
      evidenceGrade: 'A'
    },
    {
      id: '3',
      title: '5-Minuten-Yoga-Routine am Morgen',
      excerpt: 'Beginnen Sie Ihren Tag mit diesen einfachen Dehnübungen, um die Durchblutung zu fördern und Stress abzubauen.',
      type: 'video',
      category: 'Lifestyle',
      source: 'Wellness Täglich',
      date: '22. Jan. 2026',
      isVerified: false,
      link: '#',
      evidenceGrade: 'C'
    },
    {
      id: '4',
      title: 'Antibiotikaresistenz: Was Sie wissen müssen',
      excerpt: 'Warum der übermäßige Einsatz von Antibiotika eine globale Gesundheitsbedrohung darstellt und wie man ihn verhindert.',
      type: 'article',
      category: 'Medical',
      source: 'Weltgesundheitsorg.',
      date: '20. Jan. 2026',
      isVerified: true,
      link: '/article/2',
      evidenceGrade: 'A'
    }
  ],
  zh: [
    {
      id: '1',
      title: '新研究：姜黄对炎症的影响',
      excerpt: '一项随机对照试验显示，姜黄素补充剂在减轻关节疼痛方面具有良好的前景。',
      type: 'article',
      category: 'Herbal',
      source: '天然药物杂志',
      date: '2026年1月24日',
      isVerified: true,
      link: '/article/1',
      evidenceGrade: 'B'
    },
    {
      id: '2',
      title: '了解 2 型糖尿病管理',
      excerpt: '莎拉·史密斯博士讲解了关于 T2D 饮食和药物治疗的最新指南。',
      type: 'video',
      category: 'Medical',
      source: 'Ikiké Health AI 网络',
      date: '2026年1月23日',
      isVerified: true,
      link: '#',
      evidenceGrade: 'A'
    },
    {
      id: '3',
      title: '5 分钟晨间瑜伽',
      excerpt: '用这些简单的拉伸动作开始新的一天，促进血液循环，减轻压力。',
      type: 'video',
      category: 'Lifestyle',
      source: '每日健康',
      date: '2026年1月22日',
      isVerified: false,
      link: '#',
      evidenceGrade: 'C'
    },
    {
      id: '4',
      title: '抗生素耐药性：你需要了解的内容',
      excerpt: '为什么过度使用抗生素是全球健康威胁，以及如何预防。',
      type: 'article',
      category: 'Medical',
      source: '世界卫生组织',
      date: '2026年1月20日',
      isVerified: true,
      link: '/article/2',
      evidenceGrade: 'A'
    }
  ],
  ar: [
    {
      id: '1',
      title: 'دراسة جديدة: آثار الكركم على الالتهاب',
      excerpt: 'تظهر تجربة عشوائية محكومة نتائج واعدة لمكملات الكركمين في تقليل آلام المفاصل.',
      type: 'article',
      category: 'Herbal',
      source: 'مجلة الطب الطبيعي',
      date: '٢٤ يناير ٢٠٢٦',
      isVerified: true,
      link: '/article/1',
      evidenceGrade: 'B'
    },
    {
      id: '2',
      title: 'فهم إدارة مرض السكري من النوع ٢',
      excerpt: 'تشرح الدكتورة سارة سميث أحدث الإرشادات حول النظام الغذائي والأدوية لمرض السكري من النوع ٢.',
      type: 'video',
      category: 'Medical',
      source: 'شبكة Ikiké Health AI',
      date: '٢٣ يناير ٢٠٢٦',
      isVerified: true,
      link: '#',
      evidenceGrade: 'A'
    },
    {
      id: '3',
      title: 'روتين اليوغا الصباحي لمدة ٥ دقائق',
      excerpt: 'ابدأ يومك بهذه الإطالات البسيطة لتحسين الدورة الدموية وتقليل التوتر.',
      type: 'video',
      category: 'Lifestyle',
      source: 'ويلنس ديلي',
      date: '٢٢ يناير ٢٠٢٦',
      isVerified: false,
      link: '#',
      evidenceGrade: 'C'
    },
    {
      id: '4',
      title: 'مقاومة المضادات الحيوية: ما تحتاج إلى معرفته',
      excerpt: 'لماذا يعتبر الإفراط في استخدام المضادات الحيوية تهديداً صحياً عالمياً وكيفية الوقاية منه.',
      type: 'article',
      category: 'Medical',
      source: 'منظمة الصحة العالمية',
      date: '٢٠ يناير ٢٠٢٦',
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
