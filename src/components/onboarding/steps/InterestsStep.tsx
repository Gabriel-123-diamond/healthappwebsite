'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface InterestsStepProps {
  formData: any;
  toggleInterest: (topic: string) => void;
}

export default function InterestsStep({ formData, toggleInterest }: InterestsStepProps) {
  const topics = ['Herbal Medicine', 'Cardiology', 'Mental Health', 'Nutrition', 'Yoga', 'Diabetes', 'Fitness', 'Sleep'];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
      <div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 sm:mb-2 flex items-center">
          Health Interests <span className="text-red-500 ml-2">*</span>
        </h3>
        <p className="text-slate-500 font-medium text-xs sm:text-sm">Select topics to personalize your intelligence feed.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {topics.map((topic) => (
          <button 
            key={topic} 
            onClick={() => toggleInterest(topic)} 
            className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl text-sm font-black transition-all border-2 text-center flex items-center justify-center h-16 sm:h-20 ${
              formData.interests.includes(topic) 
                ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200 scale-[1.02] sm:scale-105' 
                : 'bg-white text-slate-600 border-slate-50 hover:border-blue-100 hover:bg-slate-50/50'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
