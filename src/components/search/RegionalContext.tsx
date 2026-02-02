import React from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export const RegionalContext = ({ region, insight }: { region: string, insight: string }) => (
  <motion.div 
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: 'auto' }}
    transition={{ delay: 0.3 }}
    className="px-8 py-6 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-900/30"
  >
    <div className="flex items-start gap-4">
      <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
        <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm uppercase tracking-wide mb-1">
          Cultural Context: {region}
        </h4>
        <p className="text-indigo-800 dark:text-indigo-400 text-sm leading-relaxed">
          {insight}
        </p>
      </div>
    </div>
  </motion.div>
);
