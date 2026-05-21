import React from 'react';

interface EmptyStateProps {
  text: string;
  icon: React.ReactNode;
  desc: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ text, icon, desc }) => {
  return (
    <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
      <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{text}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">{desc}</p>
    </div>
  );
};
