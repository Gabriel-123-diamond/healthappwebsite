import React from 'react';
import { ChevronRight, Zap, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  solution?: string;
  actionLabel?: string;
  actionHref?: string;
}

interface FAQAccordionProps {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQAccordion({ item, isOpen, onToggle }: FAQAccordionProps) {
  return (
    <div className={`transition-all duration-500 ${isOpen ? 'bg-blue-50/30 dark:bg-blue-900/5' : 'bg-transparent'}`}>
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between p-8 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all text-left group"
      >
        <div className="flex-1 pr-8">
          <span className="inline-block px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[8px] font-black uppercase tracking-widest mb-3">
            {item.category}
          </span>
          <h3 className={`font-black text-lg sm:text-xl tracking-tight transition-colors ${isOpen ? 'text-blue-600' : 'text-slate-800 dark:text-white group-hover:text-blue-600'}`}>
            {item.question}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180 shadow-lg shadow-blue-500/30' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
          <ChevronRight size={20} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 space-y-6">
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed font-medium">
                  {item.answer}
                </p>
                
                {item.solution && (
                  <div className="bg-white dark:bg-slate-900/50 rounded-[32px] p-6 border border-blue-500/10 shadow-inner">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap size={14} className="text-blue-600 fill-blue-600" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Recommended Solution</span>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed italic">
                      {item.solution}
                    </p>
                  </div>
                )}
              </div>

              {item.actionLabel && (
                <a 
                  href={item.actionHref}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-xl shadow-slate-900/10"
                >
                  {item.actionLabel}
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
