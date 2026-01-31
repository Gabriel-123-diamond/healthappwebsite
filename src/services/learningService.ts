export interface Lesson {
  id: string;
  title: string;
  duration: string; // e.g., "5 min"
  type: 'video' | 'article' | 'quiz';
  isCompleted?: boolean;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: 'Medical' | 'Herbal' | 'Lifestyle';
  icon: string; // Lucide icon name
  progress: number; // 0-100
  totalModules: number;
  modules: Module[];
}

const MOCK_PATHS: LearningPath[] = [
  {
    id: '1',
    title: 'Managing Hypertension',
    description: 'Learn the basics of high blood pressure, medication management, and lifestyle changes.',
    category: 'Medical',
    icon: 'Activity',
    progress: 35,
    totalModules: 3,
    modules: [
      {
        id: 'm1',
        title: 'Understanding Blood Pressure',
        lessons: [
          { id: 'l1', title: 'What is Systolic vs Diastolic?', duration: '3 min', type: 'video', isCompleted: true },
          { id: 'l2', title: 'The Silent Killer: Symptoms', duration: '5 min', type: 'article', isCompleted: false },
        ]
      },
      {
        id: 'm2',
        title: 'Dietary Changes',
        lessons: [
          { id: 'l3', title: 'The DASH Diet Explained', duration: '10 min', type: 'article', isCompleted: false },
          { id: 'l4', title: 'Reducing Sodium Intake', duration: '4 min', type: 'video', isCompleted: false },
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Herbal Remedies 101',
    description: 'A beginner’s guide to safe and effective herbal teas, tinctures, and salves.',
    category: 'Herbal',
    icon: 'Leaf',
    progress: 0,
    totalModules: 4,
    modules: []
  },
  {
    id: '3',
    title: 'Sleep Hygiene Masterclass',
    description: 'Practical steps to improve your sleep quality naturally.',
    category: 'Lifestyle',
    icon: 'Moon',
    progress: 80,
    totalModules: 2,
    modules: []
  }
];

export async function getLearningPaths(): Promise<LearningPath[]> {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PATHS), 500);
  });
}

export async function getLearningPathById(id: string): Promise<LearningPath | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_PATHS.find(p => p.id === id)), 500);
  });
}
