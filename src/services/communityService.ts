export interface Answer {
  id: string;
  authorName: string;
  authorRole: 'User' | 'Expert' | 'Moderator';
  content: string;
  timestamp: string;
  isVerifiedExpert: boolean;
  likes: number;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authorName: string;
  category: 'General' | 'Medical' | 'Herbal' | 'Lifestyle';
  timestamp: string;
  likes: number;
  answerCount: number;
  tags: string[];
  answers: Answer[];
  isResolved: boolean;
}

const MOCK_QUESTIONS: Question[] = [
  {
    id: '1',
    title: 'Safe herbal teas for pregnancy?',
    content: 'I am in my second trimester and looking for safe herbal teas to help with digestion and sleep. Any recommendations?',
    authorName: 'Sarah J.',
    category: 'Herbal',
    timestamp: '2 hours ago',
    likes: 12,
    answerCount: 2,
    tags: ['Pregnancy', 'Herbal Tea', 'Digestion'],
    isResolved: true,
    answers: [
      {
        id: 'a1',
        authorName: 'Dr. Emily Chen',
        authorRole: 'Expert',
        isVerifiedExpert: true,
        content: 'Ginger and Peppermint teas are generally considered safe and helpful for digestion. Chamomile is also good for sleep, but always consult your OBGYN first.',
        timestamp: '1 hour ago',
        likes: 45
      },
      {
        id: 'a2',
        authorName: 'Maria R.',
        authorRole: 'User',
        isVerifiedExpert: false,
        content: 'I used Lemon Balm tea and it worked wonders!',
        timestamp: '30 mins ago',
        likes: 3
      }
    ]
  },
  {
    id: '2',
    title: 'Intermittent Fasting and Blood Sugar',
    content: 'Can intermittent fasting help regulate blood sugar levels for pre-diabetics?',
    authorName: 'Mike T.',
    category: 'Medical',
    timestamp: '5 hours ago',
    likes: 34,
    answerCount: 1,
    tags: ['Diabetes', 'Diet', 'Fasting'],
    isResolved: false,
    answers: [
      {
        id: 'a3',
        authorName: 'Nutritionist Lisa',
        authorRole: 'Expert',
        isVerifiedExpert: true,
        content: 'Some studies suggest it can improve insulin sensitivity, but it is crucial to monitor your levels closely. It is not suitable for everyone.',
        timestamp: '3 hours ago',
        likes: 20
      }
    ]
  },
  {
    id: '3',
    title: 'Best exercises for lower back pain?',
    content: 'I sit at a desk all day and have chronic lower back pain. What exercises can I do at home?',
    authorName: 'Alex W.',
    category: 'Lifestyle',
    timestamp: '1 day ago',
    likes: 8,
    answerCount: 0,
    tags: ['Fitness', 'Back Pain', 'Ergonomics'],
    isResolved: false,
    answers: []
  }
];

export async function getQuestions(): Promise<Question[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_QUESTIONS), 600);
  });
}

export async function getQuestionById(id: string): Promise<Question | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_QUESTIONS.find(q => q.id === id)), 400);
  });
}
