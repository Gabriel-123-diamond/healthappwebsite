"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { AlertCircle, Clock, Globe, Tablet } from "lucide-react";

export function SafetyLogManager() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "content_logs"), orderBy("timestamp", "desc"), limit(50));
      const snap = await getDocs(q);
      setLogs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error("Failed to load safety logs", e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-red-50/30">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            Safety Audit Logs
        </h3>
        <p className="text-sm text-gray-500">Review search queries that triggered emergency red-flags.</p>
      </div>

      <div className="divide-y divide-gray-100">
        {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading logs...</div>
        ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
                <p className="font-medium">No safety incidents logged.</p>
                <p className="text-xs mt-1 text-gray-300">This is a good sign!</p>
            </div>
        ) : (
            logs.map(log => (
                <div key={log.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-black text-red-600 uppercase tracking-widest bg-red-50 px-2 py-0.5 rounded">
                            {log.warningType || 'EMERGENCY'}
                        </span>
                        <div className="flex items-center gap-3 text-gray-400">
                            <span className="text-[10px] font-bold flex items-center gap-1 uppercase">
                                {log.platform === 'web' ? <Globe size={12}/> : <Tablet size={12}/>}
                                {log.platform}
                            </span>
                            <span className="text-[10px] font-medium flex items-center gap-1">
                                <Clock size={12} />
                                {log.timestamp?.toDate().toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">"{log.query}"</h4>
                    <p className="text-sm text-gray-500 mt-1 leading-relaxed italic">{log.message}</p>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
