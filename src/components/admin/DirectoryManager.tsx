"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { ShieldCheck, ShieldAlert, Check, X, Search, Phone, MapPin } from "lucide-react";
import { DirectoryItem } from "@/types/directory";

export function DirectoryManager() {
  const [items, setItems] = useState<DirectoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchQuery] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, "directory"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as DirectoryItem));
      setItems(data);
    } catch (e) {
      console.error("Failed to load directory", e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic Update
      setItems(items.map(item => item.id === id ? { ...item, verified: !currentStatus } : item));
      
      const ref = doc(db, "directory", id);
      await updateDoc(ref, { verified: !currentStatus });
    } catch (e) {
      console.error("Update failed", e);
      fetchItems(); // Revert on error
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header & Filter */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4 items-center bg-gray-50/50">
        <div>
            <h3 className="text-lg font-bold text-gray-900">Directory Listings</h3>
            <p className="text-sm text-gray-500">Manage expert verification status.</p>
        </div>
        <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
                type="text" 
                placeholder="Search listings..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {isLoading ? (
            <div className="p-8 text-center text-gray-400">Loading directory...</div>
        ) : filteredItems.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No experts found.</div>
        ) : (
            filteredItems.map(item => (
                <div key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex gap-4 items-center overflow-hidden">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                            item.verified ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
                        }`}>
                            {item.verified ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
                        </div>
                        <div className="min-w-0">
                            <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="uppercase font-semibold bg-gray-100 px-1.5 py-0.5 rounded">{item.type}</span>
                                <span className="truncate flex items-center gap-1"><MapPin size={10} /> {item.address}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => toggleVerification(item.id, item.verified)}
                        className={`ml-4 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                            item.verified 
                                ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100" 
                                : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
                        }`}
                    >
                        {item.verified ? (
                            <>Revoke <X size={14} /></>
                        ) : (
                            <>Verify <Check size={14} /></>
                        )}
                    </button>
                </div>
            ))
        )}
      </div>
    </div>
  );
}
