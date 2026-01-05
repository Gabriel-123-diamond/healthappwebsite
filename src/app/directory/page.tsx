"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { MapView } from "@/components/features/directory/MapView";
import { DirectoryItem } from "@/types/directory";
import { Map as MapIcon, List, Phone, Star, ShieldCheck, Search, Filter, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SafetyAlert } from "@/components/features/safety/SafetyAlert";
import { checkSafety } from "@/lib/ai/safety";
import { motion, AnimatePresence } from "framer-motion";

export default function DirectoryPage() {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [view, setView] = useState<"map" | "list">("map");
  const [filter, setFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [emergencyWarning, setEmergencyWarning] = useState<any>(null);

  useEffect(() => {
    fetchDirectory();
  }, [filter, searchQuery]);

  const fetchDirectory = async () => {
    setIsLoading(true);
    try {
      const directoryRef = collection(db, "directory");
      let q = query(directoryRef);
      
      // Apply type filter
      if (filter !== "all") {
        q = query(q, where("type", "==", filter));
      }

      // Apply search prefix filter (server-side)
      if (searchQuery) {
        q = query(
          q, 
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff")
        );
      }

      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DirectoryItem));
      setItems(data);
    } catch (error) {
      console.error("Error fetching directory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Local filtering is now redundant but kept for specialty matching if needed, 
  // though server-side is preferred.
  const filteredItems = items;

  return (
    <div className="h-[calc(100vh-64px)] md:h-screen flex flex-col bg-white overflow-hidden">
      {/* Directory Header */}
      <header className="px-4 sm:px-8 py-6 border-b bg-white z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Expert Directory</h1>
                    <p className="text-sm text-gray-500 font-medium">Verified health professionals and facilities near you.</p>
                </div>
                
                <div className="flex bg-gray-100 p-1 rounded-2xl border border-gray-200">
                    <button 
                        onClick={() => setView("map")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all", 
                            view === "map" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <MapIcon size={18} />
                        <span className="hidden sm:inline">Map</span>
                    </button>
                    <button 
                        onClick={() => setView("list")}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all", 
                            view === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500 hover:text-gray-700"
                        )}
                    >
                        <List size={18} />
                        <span className="hidden sm:inline">List</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by name, specialty or symptoms..." 
                        className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium outline-none transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-2xl pl-10 pr-8 py-3 text-sm font-bold outline-none appearance-none transition-all shadow-sm cursor-pointer"
                        >
                            <option value="all">All Specialties</option>
                            <option value="doctor">Doctors</option>
                            <option value="herbalist">Herbalists</option>
                            <option value="hospital">Hospitals</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <AnimatePresence>
                {emergencyWarning && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <SafetyAlert result={emergencyWarning} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Sidebar List */}
        <div className={cn(
            "w-full md:w-[400px] border-r overflow-y-auto bg-gray-50/50 transition-all absolute md:relative inset-0 z-10 md:z-0",
            view === "map" ? "hidden md:block" : "block"
        )}>
            {isLoading ? (
                <div className="p-6 space-y-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="h-40 bg-white border border-gray-100 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="p-6 space-y-4 pb-28 md:pb-6">
                    <div className="flex justify-between items-center mb-2 px-2">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                            {filteredItems.length} Results Found
                        </span>
                    </div>
                    {filteredItems.map((item, index) => (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            key={item.id} 
                            className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all group cursor-pointer relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                    item.type === 'doctor' ? "bg-blue-100 text-blue-700" : 
                                    item.type === 'herbalist' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                    {item.type}
                                </div>
                                {item.verified && (
                                    <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                                        <ShieldCheck size={14} />
                                        <span className="text-[10px] font-bold">VERIFIED</span>
                                    </div>
                                )}
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                {item.name}
                            </h3>
                            <p className="text-sm font-medium text-gray-500 mt-1">{item.specialty}</p>
                            
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    <span className="text-sm font-bold text-gray-700">{item.rating || '5.0'}</span>
                                </div>
                                <div className="text-xs text-gray-400 font-medium truncate flex-1">
                                    {item.address.split(',')[0]}
                                </div>
                            </div>

                            <div className="mt-6 flex gap-2">
                                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-2xl text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-gray-200">
                                    <Phone size={14} /> Contact
                                </button>
                                <button className="p-3 bg-gray-100 text-gray-400 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {filteredItems.length === 0 && (
                        <div className="text-center py-20">
                            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Search size={24} />
                            </div>
                            <h3 className="font-bold text-gray-900">No results found</h3>
                            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Map View */}
        <div className={cn(
            "flex-1 relative h-full w-full bg-gray-100",
            view === "list" ? "hidden md:block" : "block"
        )}>
            <MapView items={filteredItems} />
            
            {/* Mobile View Toggle (Floating Action Button) */}
            <div className="md:hidden absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
                <button 
                    onClick={() => setView(view === "map" ? "list" : "map")}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-bold shadow-2xl animate-bounce"
                >
                    {view === "map" ? <List size={18} /> : <MapIcon size={18} />}
                    {view === "map" ? "Show List" : "Show Map"}
                </button>
            </div>
        </div>
      </main>
    </div>
  );
}
