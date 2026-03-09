import React from 'react';
import { Calendar, Award, Users, Star } from 'lucide-react';
import ExpertStatCard from '@/components/expert/ExpertStatCard';

interface ExpertStatsGridProps {
  appointmentsCount: number;
  articlesCount: number;
  coursesCount: number;
  views: string;
  rating: string;
}

export const ExpertStatsGrid: React.FC<ExpertStatsGridProps> = ({
  appointmentsCount,
  articlesCount,
  coursesCount,
  views,
  rating,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
      <ExpertStatCard 
        icon={<Calendar />} 
        label="Clinical Sessions" 
        value={appointmentsCount.toString()} 
        color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
      />
      <ExpertStatCard 
        icon={<Award />} 
        label="Clinical Impact" 
        value={(articlesCount * 10 + coursesCount * 50).toString()} 
        color="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" 
      />
      <ExpertStatCard 
        icon={<Users />} 
        label="Global Reach" 
        value={views} 
        color="bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" 
      />
      <ExpertStatCard 
        icon={<Star />} 
        label="Patient Rating" 
        value={rating} 
        color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" 
      />
    </div>
  );
};
