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
    <div className="space-y-2">
      <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-6 ml-4">Dissector Sectors</h3>
      <div className="flex flex-col gap-1.5">
        {COMMUNITY_TOPICS.map((topic) => {
          const Icon = TOPIC_ICONS[topic] || Shield;
          const isActive = selectedTopic === topic;
          
          return (
            <button
              key={topic}
              onClick={() => onTopicSelect(topic)}
              className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 translate-x-2' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-blue-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500 transition-colors'} />
                <span className="tracking-tight">{topic}</span>
              </div>
              {isActive && (
                <motion.div layoutId="sidebar-active" className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
              )}
              {!isActive && (
                <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
