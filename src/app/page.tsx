"use client";

import { useState, useEffect } from "react";
import { Activity, Sparkles, History, ArrowRight, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchInput } from "@/components/features/search/SearchInput";
import { ModeToggle } from "@/components/features/search/ModeToggle";
import { SafetyAlert } from "@/components/features/safety/SafetyAlert";
import { SearchResults } from "@/components/features/search/SearchResults";
import { searchHealthInfo, SearchResponse, SearchMode } from "@/lib/ai/service";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveSearchHistory, getSearchHistory } from "@/lib/user-service";
import { GlobalDisclaimer } from "@/components/features/compliance/GlobalDisclaimer";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mode, setMode] = useState<SearchMode>("medical");
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSplash, setShowSplash] = useState(true); // Splash state
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Load recent searches from Firestore if user is logged in
  useEffect(() => {
    if (user) {
        getSearchHistory(user.uid).then(history => {
            setRecentSearches(history.map(h => h.query));
        });
    }
  }, [user]);

  const handleSearch = async (overrideQuery?: string) => {
    if (!user) {
        router.push("/login");
        return;
    }

    const q = overrideQuery || searchQuery;
    if (!q.trim()) return;
    
    setSearchQuery(q);
    setIsLoading(true);
    setResults(null); 
    
    try {
      // 1. Check Directory First
      const dirQuery = query(
        collection(db, "directory"), 
        where("name", ">=", q), 
        where("name", "<=", q + '\uf8ff')
      );
      const dirSnap = await getDocs(dirQuery);
      
      if (!dirSnap.empty) {
          // Found a match in directory -> Redirect
          router.push(`/directory?search=${encodeURIComponent(q)}`);
          return;
      }

      // 2. Perform AI Search
      const data = await searchHealthInfo(q, mode);
      setResults(data);
      if (data.safetyCheck.isSafe) {
          // Save to Firestore
          saveSearchHistory(user.uid, q, mode, data.summary);
          // Optimistic update
          setRecentSearches(prev => [q, ...prev.filter(s => s !== q)].slice(0, 5));
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 font-sans bg-[#F8FAFC] overflow-x-hidden relative">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#F8FAFC]"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "backOut" }}
              className="p-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 shadow-2xl shadow-blue-300 mb-8"
            >
              <Activity size={64} className="text-white" />
            </motion.div>
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center"
            >
                <h1 className="text-4xl font-black text-slate-900 mb-2">
                  Global Health <span className="text-cyan-500">AI</span>
                </h1>
                <p className="text-slate-500 font-medium">Verified Medical & Herbal Knowledge</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/30 rounded-full blur-[120px]" />
      </div>
      
      {/* Dynamic Header */}
      <motion.header 
        layout
        className={cn(
          "flex flex-col items-center gap-4 text-center z-10 transition-all duration-700 ease-in-out",
          results ? "mt-0 scale-90" : "mt-[30vh]" // Moved further down for better centering
        )}
      >
        <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 p-4 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-3xl shadow-xl shadow-blue-200"
        >
          <Activity size={40} />
        </motion.div>
        
        <div className="space-y-2">
            <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-500 drop-shadow-sm pb-2">
                Global Health <span className="text-cyan-500">AI</span>
            </h1>
            <AnimatePresence>
                {!results && (
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed font-medium"
                    >
                        Verified Orthodox Medicine & Traditional Herbal Knowledge.
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Search Area */}
      <main className="w-full max-w-3xl flex flex-col items-center gap-6 z-10 mt-8">
        <motion.div layout className="w-full flex flex-col items-center gap-6">
            <ModeToggle currentMode={mode} onModeChange={setMode} />
            
            <SearchInput 
                value={searchQuery} 
                onChange={setSearchQuery} 
                onSearch={() => handleSearch()} 
                isLoading={isLoading}
                className="shadow-xl shadow-blue-100/50"
            />
        </motion.div>

        {/* Recent Searches */}
        {!results && recentSearches.length > 0 && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-xl flex flex-wrap gap-2 justify-center mt-4"
            >
                <div className="w-full text-center text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    <History size={12} /> Recent
                </div>
                {recentSearches.map((s) => (
                    <button
                        key={s}
                        onClick={() => handleSearch(s)}
                        className="px-4 py-1.5 bg-white border border-gray-100 text-gray-600 rounded-full text-sm hover:border-blue-200 hover:text-blue-600 hover:shadow-sm transition-all flex items-center gap-1 group"
                    >
                        {s}
                        <ArrowRight size={12} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    </button>
                ))}
            </motion.div>
        )}

        {/* Results Layer */}
        <div className="w-full flex flex-col items-center gap-4 mt-2 pb-20">
            <AnimatePresence mode="wait">
                {results?.safetyCheck && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full flex justify-center"
                    >
                        <SafetyAlert result={results.safetyCheck} />
                    </motion.div>
                )}
                {results && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full flex flex-col items-center"
                    >
                        <SearchResults data={results} />
                        <div className="mt-12 w-full">
                            <GlobalDisclaimer />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </main>

      {/* Footer - Fixed only when idle */}
      {!results && (
        <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]"
        >
          <GlobalDisclaimer />
        </motion.footer>
      )}
    </div>
  );
}