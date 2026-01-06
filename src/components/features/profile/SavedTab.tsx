"use client";

import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";
import { SavedResource } from "@/lib/user-service";

interface SavedTabProps {
  saved: SavedResource[];
}

export function SavedTab({ saved }: SavedTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      key="saved"
      className="space-y-4"
    >
      {saved.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center text-gray-400">
          <Bookmark size={48} className="mx-auto mb-4 opacity-20" />
          <p>No saved items yet.</p>
        </div>
      ) : (
        saved.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
            <a href={item.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate block">
              {item.link}
            </a>
          </div>
        ))
      )}
    </motion.div>
  );
}