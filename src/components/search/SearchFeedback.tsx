'use client';

import React, { useState } from 'react';
import { Star, MessageSquare, CheckCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface SearchFeedbackProps {
  query: string;
}

const feedbackTags = [
  'Accurate',
  'Helpful',
  'Easy to understand',
  'Irrelevant',
  'Incorrect',
  'Too complex'
];

const getEmoji = (r: number) => {
  switch (r) {
    case 1: return '😞';
    case 2: return '😐';
    case 3: return '🙂';
    case 4: return '😊';
    case 5: return '🤩';
    default: return '';
  }
};

export const SearchFeedback: React.FC<SearchFeedbackProps> = ({ query }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    try {
      const user = auth.currentUser;
      const feedbackData = {
        userId: user?.uid,
        userName: user?.email || 'Anonymous',
        query,
        rating,
        tags: selectedTags,
        comment,
        timestamp: serverTimestamp(),
        platform: 'web'
      };

      // Save to general collection
      await addDoc(collection(db, 'search_feedback'), feedbackData);

      // Save to user subcollection if logged in
      if (user?.uid) {
        await addDoc(collection(db, `users/${user.uid}/polls`), feedbackData);
      }

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl border border-green-100 dark:border-green-800 text-center"
      >
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h4 className="text-lg font-bold text-green-900 dark:text-green-300 mb-1">Thanks for your feedback!</h4>
        <p className="text-sm text-green-700 dark:text-green-400">Your input helps us improve Ikiké Health AI.</p>
      </motion.div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700">
      <div className="text-center mb-6">
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Was this result helpful?</h4>
        
        <div className="h-8 mb-2">
          <AnimatePresence mode="wait">
            {(hoverRating || rating) && (
              <motion.div
                key={hoverRating || rating}
                initial={{ opacity: 0, y: 10, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-3xl"
              >
                {getEmoji(hoverRating || rating || 0)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-3">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onHoverStart={() => setHoverRating(star)}
              onHoverEnd={() => setHoverRating(null)}
              className="p-1 transition-colors"
            >
              <Star 
                className={`w-10 h-10 ${
                  (hoverRating || rating) && star <= (hoverRating || rating || 0) 
                    ? 'fill-amber-400 text-amber-400' 
                    : 'text-slate-200 dark:text-slate-600'
                }`} 
              />
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* ... (rest of render) */}

      <AnimatePresence>
        {rating && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="space-y-3">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-wider">Select all that apply</p>
              <div className="flex flex-wrap justify-center gap-2">
                {feedbackTags.map(tag => (
                  <motion.button
                    key={tag}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 dark:shadow-none'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:border-blue-400'
                    }`}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share more about your experience... (Optional)"
                className="w-full px-4 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/20 outline-none transition-all resize-none h-32"
              />
              <MessageSquare className="absolute right-4 bottom-4 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 dark:shadow-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Submit Feedback
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
