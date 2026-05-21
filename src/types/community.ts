export const COMMUNITY_TOPICS = [
  { id: 'general', name: 'General Health', icon: 'activity' },
  { id: 'maternal-health', name: 'Maternal Health', icon: 'baby' },
  { id: 'nutrition', name: 'Nutrition', icon: 'apple' },
  { id: 'herbal-knowledge', name: 'Herbal Registry', icon: 'leaf' },
  { id: 'mental-wellbeing', name: 'Mental Health', icon: 'brain' },
];

export interface CommunityPost {
  id: string;
  topicId: string;
  topic: string;
  userId: string;
  authorName: string;
  authorRole: string;
  content: string;
  likes: string[]; // array of userIds
  comments: number;
  type: 'question' | 'discussion';
  timestamp: any;
  createdAt: any; // Legacy support
}

export interface CommunityAnswer {
  id?: string;
  postId: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  isExpert: boolean;
  createdAt: any;
}
