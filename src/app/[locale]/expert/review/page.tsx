'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { getPendingReviews, updateReviewStatus, AIReview } from '@/services/reviewService';
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Loader2, 
  Search, 
  Clock, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

export default function ExpertReviewPage() {
  const [reviews, setReviews] = useState<AIReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<AIReview | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedAnswer, setEditedAnswer] = useState('');
  const [expertComment, setExpertComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getPendingReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchReviews();
    });
    return () => unsubscribe();
  }, []);

  const handleAction = async (status: 'approved' | 'rejected' | 'edited') => {
    if (!selectedReview || !auth.currentUser) return;
    
    setSubmitting(true);
    try {
      await updateReviewStatus(
        selectedReview.id, 
        status, 
        auth.currentUser.uid,
        expertComment,
        status === 'edited' ? editedAnswer : undefined
      );
      
      setSelectedReview(null);
      setIsEditing(false);
      setExpertComment('');
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar - List of Reviews */}
      <div className="w-1/3 border-r border-slate-200 bg-white h-screen overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-xl font-bold text-slate-900">Expert Review Queue</h1>
          <p className="text-sm text-slate-500 mt-1">Audit AI-generated health responses</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-12 text-center">
            <CheckCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">All caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((review) => (
              <button
                key={review.id}
                onClick={() => {
                  setSelectedReview(review);
                  setEditedAnswer(review.answer);
                  setIsEditing(false);
                }}
                className={`w-full p-6 text-left hover:bg-slate-50 transition-colors ${
                  selectedReview?.id === review.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    review.mode === 'medical' ? 'bg-blue-100 text-blue-700' : 
                    review.mode === 'herbal' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {review.mode}
                  </span>
                  <span className="text-xs text-slate-400">
                    {format(review.timestamp, 'MMM dd, HH:mm')}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 line-clamp-2 mb-2">{review.query}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <Clock className="w-3 h-3" />
                  Pending Audit
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content - Detail View */}
      <div className="flex-1 h-screen overflow-y-auto bg-slate-50 p-12">
        {selectedReview ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <Search className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase tracking-widest">Original Query</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedReview.query}</h2>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-blue-600">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-bold">AI Generated Response</span>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
                  >
                    <Edit3 className="w-4 h-4" />
                    {isEditing ? 'Cancel Edit' : 'Edit Answer'}
                  </button>
                </div>

                {isEditing ? (
                  <textarea
                    value={editedAnswer}
                    onChange={(e) => setEditedAnswer(e.target.value)}
                    className="w-full h-96 p-6 rounded-2xl border border-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="prose prose-slate max-w-none prose-sm">
                    <ReactMarkdown>{selectedReview.answer}</ReactMarkdown>
                  </div>
                )}

                <div className="mt-12 pt-8 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    Expert Comments (Optional)
                  </label>
                  <textarea
                    value={expertComment}
                    onChange={(e) => setExpertComment(e.target.value)}
                    placeholder="Add a note about why this was approved, rejected, or edited..."
                    className="w-full p-4 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    disabled={submitting}
                    onClick={() => handleAction('approved')}
                    className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve
                  </button>
                  <button
                    disabled={submitting}
                    onClick={() => handleAction(isEditing ? 'edited' : 'approved')}
                    className={`flex-1 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 border-2 ${
                      isEditing 
                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                        : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                    } disabled:opacity-50`}
                  >
                    <Edit3 className="w-5 h-5" />
                    {isEditing ? 'Save & Approve Edits' : 'Mark as Edited'}
                  </button>
                  <button
                    disabled={submitting}
                    onClick={() => handleAction('rejected')}
                    className="flex-1 border-2 border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <Search className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg">Select a query from the queue to start reviewing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
