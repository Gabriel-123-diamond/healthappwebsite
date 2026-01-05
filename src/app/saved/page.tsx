"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSavedResources, SavedResource } from "@/lib/user-service";
import { Bookmark, Calendar, ExternalLink } from "lucide-react";

export default function SavedPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<SavedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (user) {
      fetchResources();
    }
  }, [user, startDate, endDate]);

  const fetchResources = async () => {
    if (!user) return;
    setLoading(true);
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    if (end) end.setHours(23, 59, 59, 999);

    const data = await getSavedResources(user.uid, start, end);
    setResources(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <Bookmark className="text-blue-600" /> Saved Resources
            </h1>
            <p className="text-gray-500 mt-1">Your bookmarked articles and videos.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
            <Calendar size={16} className="text-gray-400 ml-2" />
            <input 
              type="date" 
              className="text-sm bg-transparent outline-none text-gray-600"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-gray-300">-</span>
            <input 
              type="date" 
              className="text-sm bg-transparent outline-none text-gray-600"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl animate-pulse" />)}
          </div>
        ) : resources.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <Bookmark size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No saved items</h3>
            <p className="text-gray-500">Bookmark search results to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resources.map((item) => (
              <a 
                key={item.id} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all flex justify-between items-start"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                  {item.snippet && (
                    <p className="text-gray-600 mt-2 text-sm line-clamp-2">{item.snippet}</p>
                  )}
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-lg uppercase">{item.type || 'Article'}</span>
                    <span className="text-xs text-gray-400">
                        {item.timestamp?.toDate().toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ExternalLink className="text-gray-300 group-hover:text-blue-500 transition-colors" size={20} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
