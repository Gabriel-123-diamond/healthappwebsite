"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getSearchHistory, SearchHistoryItem } from "@/lib/user-service";
import { History, Calendar } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [user, startDate, endDate]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    // Adjust end date to end of day if present
    if (end) end.setHours(23, 59, 59, 999);

    const data = await getSearchHistory(user.uid, start, end);
    setHistory(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
              <History className="text-blue-600" /> Search History
            </h1>
            <p className="text-gray-500 mt-1">View your past searches and summaries.</p>
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
        ) : history.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <History size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-900">No history found</h3>
            <p className="text-gray-500">Searches you make will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-gray-900">{item.query}</h3>
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg uppercase">{item.mode}</span>
                </div>
                {item.summary && (
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">{item.summary}</p>
                )}
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                  <span className="text-xs text-gray-400">
                    {item.timestamp?.toDate().toLocaleDateString()} • {item.timestamp?.toDate().toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
