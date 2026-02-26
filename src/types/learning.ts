export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'article' | 'quiz';
  content?: string;
  videoUrl?: string;
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
  icon: string;
  authorId: string;
  authorName: string;
  progress?: number;
  totalModules: number;
  modules: Module[];
  status: 'draft' | 'published';
  createdAt: string;
}
