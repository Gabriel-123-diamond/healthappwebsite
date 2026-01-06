"use client";

import { Search, ChevronRight, History } from "lucide-react";
import { motion } from "framer-motion";
import { SearchHistoryItem } from "@/lib/user-service";

interface HistoryTabProps {
  history: SearchHistoryItem[];
}

export function HistoryTab({ history }: HistoryTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      key="history"
      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {history.length === 0 ? (
        <div className="p-12 text-center text-gray-400">
          <History size={48} className="mx-auto mb-4 opacity-20" />
          <p>No search history yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {history.map((item) => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Search size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">{item.query}</p>
                  <p className="text-xs text-gray-400">
                    {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : "Recent"} • {item.mode}
                  </p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500" />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}