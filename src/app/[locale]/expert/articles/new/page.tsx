'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { contentService } from '@/services/contentService';
import { useLanguage } from '@/context/LanguageContext';
import { BaseInput } from '@/components/common/BaseInput';
import { BaseTextArea } from '@/components/common/BaseTextArea';
import { FileText, Save, Send, Image as ImageIcon, Tags, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ExpertLayout } from '@/components/expert/ExpertLayout';

export default function NewArticlePage() {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Medical' | 'Herbal' | 'Lifestyle'>('Medical');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expertName, setExpertName] = useState('');
  
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const fetchExpertData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setExpertName(userDoc.data().name);
        }
      }
    };
    fetchExpertData();
  }, []);

  const handlePublish = async (status: 'draft' | 'published') => {
    if (!title || !content || !summary) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (user) {
        await contentService.createArticle({
          title,
          summary,
          content,
          category,
          imageUrl,
          author: expertName,
          authorId: user.uid,
          date: new Date().toLocaleDateString(),
          evidenceGrade: 'A', // Default to A for experts, admin can review
          tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
          status,
          isExpertVerified: true,
        });
        
        router.push('/expert/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save article');
    } finally {
      setLoading(false);
    }
  };

  const actions = (
    <>
      <button
        onClick={() => handlePublish('draft')}
        disabled={loading}
        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-2 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700"
      >
        <Save className="w-4 h-4" />
        Save Draft
      </button>
      <button
        onClick={() => handlePublish('published')}
        disabled={loading}
        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Publish Article
      </button>
    </>
  );

  return (
    <ExpertLayout
      title="Create New Article"
      subtitle="Share your medical or herbal expertise with the global community."
      actions={actions}
    >
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-100 dark:border-slate-700 space-y-8">
          <div className="space-y-4">
            <BaseInput
              id="title"
              name="title"
              label="Article Title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Understanding Modern Herbal Medicine"
              className="text-xl font-bold"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest flex items-center gap-1 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition-all"
                >
                  <option value="Medical">Medical Science</option>
                  <option value="Herbal">Traditional Herbal</option>
                  <option value="Lifestyle">Lifestyle & Wellness</option>
                </select>
              </div>
              <BaseInput
                id="imageUrl"
                name="imageUrl"
                label="Cover Image URL (Optional)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                prefixIcon={<ImageIcon className="w-4 h-4 text-slate-400" />}
              />
            </div>

            <BaseTextArea
              id="summary"
              label="Short Summary"
              required
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
              placeholder="Briefly describe what this article is about..."
              helperText="Visible in search results and feeds."
            />

            <BaseTextArea
              id="content"
              label="Full Content"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={15}
              placeholder="Write your detailed article here..."
              className="font-serif text-lg leading-relaxed"
            />

            <BaseInput
              id="tags"
              name="tags"
              label="Tags (Comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="diabetes, prevention, natural-cures"
              prefixIcon={<Tags className="w-4 h-4 text-slate-400" />}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800 text-center">
              {error}
            </div>
          )}
        </div>
    </ExpertLayout>
  );
}
