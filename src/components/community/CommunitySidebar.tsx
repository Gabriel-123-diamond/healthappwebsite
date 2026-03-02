'use client';

import React from 'react';
import { COMMUNITY_TOPICS } from '@/services/communityService';

interface CommunitySidebarProps {
  selectedTopic: string;
  onTopicSelect: (topic: string) => void;
}

import { motion } from 'framer-motion';
import { 
  Heart, Brain, Baby, Shield, Activity, Stethoscope, 
  Leaf, Info, ChevronRight 
} from 'lucide-react';

const TOPIC_ICONS: Record<string, any> = {
  'General Health': Activity,
  'Mental Wellness': Brain,
  'Pediatrics': Baby,
  'Traditional Wisdom': Leaf,
  'Medical News': Info,
  'Chronic Care': Stethoscope,
};

export const CommunitySidebar: React.FC<CommunitySidebarProps> = ({ selectedTopic, onTopicSelect }) => {
  return (
    <div className="space-y-2 lg:space-y-6">
      <h3 className="hidden lg:block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 ml-4">Dissector Sectors</h3>
      <div className="flex flex-row lg:flex-col gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-x-visible no-scrollbar pb-4 lg:pb-0 px-1 lg:px-0 -mx-4 lg:mx-0 pl-4 lg:pl-0">
        {COMMUNITY_TOPICS.map((topic) => {
          const Icon = TOPIC_ICONS[topic] || Shield;
          const isActive = selectedTopic === topic;
          
          return (
            <button
              key={topic}
              onClick={() => onTopicSelect(topic)}
              className={`group flex items-center justify-between px-5 py-3 lg:py-4 rounded-2xl text-xs lg:text-sm font-bold transition-all duration-300 shrink-0 lg:shrink ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 lg:translate-x-2' 
                  : 'bg-white dark:bg-slate-900 lg:bg-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600 border border-slate-100 dark:border-slate-800 lg:border-none shadow-sm lg:shadow-none'
              }`}
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <Icon size={isActive ? 16 : 18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500 transition-colors'} />
                <span className="tracking-tight whitespace-nowrap">{topic}</span>
              </div>
              {isActive && (
                <motion.div layoutId="sidebar-active" className="hidden lg:block w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
              {!isActive && (
                <ChevronRight size={14} className="hidden lg:block opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
