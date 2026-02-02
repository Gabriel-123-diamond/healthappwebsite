import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PlayCircle, FileText, ShieldCheck } from 'lucide-react';

interface SourceListProps {
  results: any[];
  filterFormat?: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const getGradeColor = (grade?: string) => {
  switch (grade) {
    case 'A': return 'bg-green-100 text-green-700 border-green-200';
    case 'B': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'C': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'D': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-slate-100 text-slate-600 border-slate-200';
  }
};

export const SourceList: React.FC<SourceListProps> = ({ results, filterFormat }) => {
  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-900/50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trusted Sources ({results.length})</h3>
      </div>
      <motion.div className="grid gap-4">
        {results.length > 0 ? (
          results.map((result, index) => (
          <motion.a 
            key={result.id} 
            href={result.link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 5 }}
            className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors flex items-start gap-4 group cursor-pointer shadow-sm hover:shadow-md no-underline"
          >
            <div className={`p-3 rounded-xl flex-shrink-0 ${result.format === 'video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              {result.format === 'video' ? <PlayCircle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{result.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{result.summary}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  result.format === 'video' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {result.format === 'video' ? 'Video' : 'Article'}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                  result.type === 'medical' ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {result.type === 'medical' ? 'Medical' : 'Herbal'}
                </span>
                {result.evidenceGrade && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border flex items-center gap-1 ${getGradeColor(result.evidenceGrade)}`}>
                    <ShieldCheck className="w-3 h-3" />
                    Grade {result.evidenceGrade}
                  </span>
                )}
                <span className="text-xs text-slate-400">• {result.source}</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors self-center" />
          </motion.a>
        ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm">
            No {filterFormat === 'all' ? '' : filterFormat} sources found matching your query.
          </div>
        )}
      </motion.div>
    </div>
  );
};
