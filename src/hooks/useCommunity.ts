import { useState, useEffect, useCallback } from 'react';
import { communityService, CommunityPost, COMMUNITY_TOPICS } from '@/services/communityService';
import { auth } from '@/lib/firebase';

export function useCommunity() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('General');
  const [isPosting, setIsPosting] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const data = await communityService.getPosts(selectedTopic);
    setPosts(data);
    setLoading(false);
  }, [selectedTopic]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const submitPost = async (content: string, authorName: string, authorRole: string, type: string = 'post') => {
    setIsPosting(true);
    try {
      await communityService.addPost(content, authorName, authorRole, selectedTopic, type);
      await loadPosts();
    } finally {
      setIsPosting(false);
    }
  };

  const reportPost = async (postId: string, reason: string) => {
    await communityService.reportPost(postId, reason);
  };

  const toggleLike = async (postId: string, isLiked: boolean) => {
    await communityService.toggleLike(postId, isLiked);
  };

  return {
    posts,
    loading,
    selectedTopic,
    setSelectedTopic,
    isPosting,
    submitPost,
    reportPost,
    toggleLike,
    topics: COMMUNITY_TOPICS
  };
}