'use client';

import React from 'react';
import { User as UserIcon, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';

interface ProfileHeaderProps {
  user: User;
  onEdit: () => void;
}

export default function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center relative group"
    >
      <button 
        onClick={onEdit}
        className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
        title="Edit Profile"
      >
        <Edit className="w-5 h-5" />
      </button>

      <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4 border-4 border-white shadow-lg text-4xl font-bold">
        {user.email?.[0].toUpperCase() || <UserIcon className="w-10 h-10" />}
      </div>
      <h1 className="text-2xl font-bold text-slate-900">{user.displayName || 'HealthAI User'}</h1>
      <p className="text-slate-500">{user.email}</p>
    </motion.div>
  );
}
