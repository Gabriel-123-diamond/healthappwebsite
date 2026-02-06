import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

export const VerifiedExperts = ({ experts, total, query }: { experts: any[], total: number, query?: string }) => {
  if (!experts || experts.length === 0) return null;

  return (
    <div className="mx-4 sm:mx-8 my-6 flex flex-col gap-4">
      <h3 className="text-[10px] sm:text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-2 px-2">
        Verified Experts ({total || experts.length})
      </h3>
      {experts.map((expert, idx) => (
        <motion.div 
          key={expert.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20px" }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="p-4 sm:p-6 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="p-2 sm:p-3 bg-white/20 rounded-xl backdrop-blur-sm shrink-0">
              <Users className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-black text-base sm:text-lg truncate">{expert.name}</h4>
              <p className="text-blue-100 text-xs sm:text-sm truncate">
                {expert.specialty} • {expert.location}
              </p>
            </div>
          </div>
          <Link 
            href={`/directory/${expert.id}`}
            className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-50 transition-all active:scale-95 text-center text-sm sm:text-base whitespace-nowrap"
          >
            View Profile
          </Link>
        </motion.div>
      ))}
      
      {(total || 0) > 4 && query && (
        <Link 
          href={`/directory?query=${encodeURIComponent(query)}`}
          className="text-center py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-all border-2 border-blue-50 active:scale-95 text-sm sm:text-base"
        >
          See all {total} experts
        </Link>
      )}
    </div>
  );
};
