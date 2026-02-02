import React from 'react';
import { Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';

export const VerifiedExperts = ({ experts, total, query }: { experts: any[], total: number, query?: string }) => {
  if (!experts || experts.length === 0) return null;

  return (
    <div className="mx-8 my-6 flex flex-col gap-4">
      <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        Verified Experts ({total || experts.length})
      </h3>
      {experts.map((expert, idx) => (
        <motion.div 
          key={expert.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ margin: "-20px" }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="p-6 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200 dark:shadow-none flex items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg">{expert.name}</h4>
              <p className="text-blue-100 text-sm">
                {expert.specialty} • {expert.location}
              </p>
            </div>
          </div>
          <Link 
            href={`/directory/${expert.id}`}
            className="bg-white text-blue-600 px-6 py-2 rounded-xl font-bold hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            View
          </Link>
        </motion.div>
      ))}
      
      {(total || 0) > 4 && query && (
        <Link 
          href={`/directory?query=${encodeURIComponent(query)}`}
          className="text-center py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-xl transition-colors border border-blue-100"
        >
          See all {total} experts
        </Link>
      )}
    </div>
  );
};
