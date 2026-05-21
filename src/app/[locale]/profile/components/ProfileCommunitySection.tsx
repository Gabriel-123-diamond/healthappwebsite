import React from 'react';

interface ProfileCommunitySectionProps {
  interests?: string[];
}

export const ProfileCommunitySection: React.FC<ProfileCommunitySectionProps> = ({ interests }) => {
  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-3 px-4">
        <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">Community Intelligence</span>
        <div className="h-px flex-1 bg-gradient-to-r from-indigo-600/20 to-transparent" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-xl hover:border-indigo-500/30 transition-all group cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 text-[8px] font-black uppercase tracking-widest">Article</div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">5 min read</span>
            </div>
            <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 transition-colors mb-4">The Future of {interests?.[0] || 'Integrative Health'}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">Discover how personalized AI routing is transforming the way we access traditional healing wisdom...</p>
          </div>
        ))}
      </div>
    </div>
  );
};
