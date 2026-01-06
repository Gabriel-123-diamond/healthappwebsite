import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db, getDocWithRetry } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { 
  User, MapPin, Phone, Shield, Calendar, Edit2, Save, X, 
  History, Bookmark, Settings, ChevronRight, Activity, Search,
  Loader2, Check
} from "lucide-react";
import { getSearchHistory, getSavedResources, SearchHistoryItem, SavedResource } from "@/lib/user-service";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [saved, setSaved] = useState<SavedResource[]>([]);
  
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "saved">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // 1. Profile
        const docSnap = await getDocWithRetry(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
          setEditForm({
            firstName: data.firstName || data.fullName?.split(" ")[0] || "",
            lastName: data.lastName || data.fullName?.split(" ")[1] || "",
            phone: data.phone || ""
          });
        } else {
          router.push("/profile-setup");
        }

        // 2. History & Saved (Parallel)
        const [histData, savedData] = await Promise.all([
            getSearchHistory(user.uid),
            getSavedResources(user.uid)
        ]);
        setHistory(histData);
        setSaved(savedData);

      } catch (e) {
        console.error("Error fetching profile data", e);
      }
    };

    fetchData();
  }, [user, loading, router]);

  // Phone Check Effect
  useEffect(() => {
    if (!isEditing || editForm.phone === profile?.phone) {
        setPhoneStatus("idle");
        return;
    }

    const checkPhone = async () => {
      if (editForm.phone.length < 7) {
        setPhoneStatus("idle");
        return;
      }
      setPhoneStatus("checking");
      
      try {
        // Query users collection for this phone
        // Note: Assuming phone format is consistent. In setup we join code+number.
        // Here we are editing the full string.
        const q = query(collection(db, "users"), where("phone", "==", editForm.phone));
        const snap = await getDocs(q);
        
        // Exclude current user from check (though unlikely to match if we checked equality)
        const isTaken = !snap.empty && snap.docs[0].id !== user?.uid;

        if (isTaken) {
            setPhoneStatus("taken");
        } else {
            setPhoneStatus("available");
        }
      } catch (e) {
        console.error("Phone check error:", e);
        setPhoneStatus("idle");
      }
    };

    const timeoutId = setTimeout(checkPhone, 500);
    return () => clearTimeout(timeoutId);
  }, [editForm.phone, isEditing, profile, user]);

    const handleSave = async () => {
    if (!user) return;
    if (phoneStatus === "taken" || phoneStatus === "checking") return;

    setIsSaving(true);
    try {
        // Only update phone
        await updateDoc(doc(db, "users", user.uid), {
            phone: editForm.phone
        });
        setProfile((prev: any) => ({ ...prev, phone: editForm.phone }));
        setIsEditing(false);
        setPhoneStatus("idle");
    } catch (e) {
        console.error("Failed to update profile", e);
    } finally {
        setIsSaving(false);
    }
  };

  if (loading || !profile) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-400 font-bold animate-pulse">Loading Profile...</p>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      {/* Header Banner */}
      <div className="bg-white border-b border-gray-200">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        </div>
        
        <div className="max-w-5xl mx-auto px-6 pb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
                {/* Avatar */}
                <div className="relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-1.5 shadow-xl">
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover bg-gray-100" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <User size={40} />
                            </div>
                        )}
                    </div>
                    {profile.role === "doctor" && (
                        <div className="absolute bottom-1 right-1 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified Doctor">
                            <Shield size={16} fill="currentColor" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start">
                        <div>
                            {isEditing ? (
                                <div className="flex gap-2 mb-2">
                                    <input 
                                        value={editForm.firstName}
                                        disabled
                                        className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-lg font-bold w-32 outline-none text-gray-500 cursor-not-allowed"
                                        title="Name cannot be changed"
                                    />
                                    <input 
                                        value={editForm.lastName}
                                        disabled
                                        className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-lg font-bold w-32 outline-none text-gray-500 cursor-not-allowed"
                                        title="Name cannot be changed"
                                    />
                                </div>
                            ) : (
                                <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                                    {profile.fullName || "User"}
                                </h1>
                            )}
                            <p className="text-gray-500 font-medium">@{profile.username}</p>
                        </div>
                        
                        {!isEditing ? (
                            <button 
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            >
                                <Edit2 size={20} />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setIsEditing(false)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl"
                                >
                                    <X size={20} />
                                </button>
                                <button 
                                    onClick={handleSave}
                                    disabled={isSaving || phoneStatus === "taken" || phoneStatus === "checking"}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-xl bg-green-50/50 disabled:opacity-50"
                                >
                                    {isSaving ? <Activity className="animate-spin" size={20} /> : <Save size={20} />}
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-500">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                            <MapPin size={14} className="text-blue-500" />
                            {profile.region || "Unknown Location"}
                        </div>
                        {isEditing ? (
                             <div className="relative">
                                <input 
                                    value={editForm.phone}
                                    onChange={e => setEditForm({...editForm, phone: e.target.value})}
                                    className={cn(
                                        "bg-gray-50 border border-gray-200 rounded-lg px-2 py-0.5 text-sm w-40 outline-none focus:border-blue-500 text-gray-900 pr-8",
                                        phoneStatus === "taken" && "border-red-500 text-red-600"
                                    )}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                    {phoneStatus === "checking" && <Loader2 className="animate-spin text-gray-400" size={12} />}
                                    {phoneStatus === "available" && <Check className="text-green-500" size={12} />}
                                    {phoneStatus === "taken" && <X className="text-red-500" size={12} />}
                                </div>
                             </div>
                        ) : (
                            <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                                <Phone size={14} className="text-green-500" />
                                {profile.phone || "No Phone"}
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                            <Calendar size={14} className="text-purple-500" />
                            Joined {profile.createdAt?.toDate ? new Date(profile.createdAt.toDate()).getFullYear() : '2024'}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-5xl mx-auto px-6 flex gap-8 border-t border-gray-100 mt-2">
            {[
                { id: "overview", label: "Overview", icon: Activity },
                { id: "history", label: "Search History", icon: History },
                { id: "saved", label: "Saved Items", icon: Bookmark },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                        "py-4 text-sm font-bold flex items-center gap-2 border-b-2 transition-all",
                        activeTab === tab.id 
                            ? "border-blue-600 text-blue-600" 
                            : "border-transparent text-gray-400 hover:text-gray-600"
                    )}
                >
                    <tab.icon size={16} />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content (Unchanged) */}
      <div className="max-w-5xl mx-auto p-6">
        <AnimatePresence mode="wait">
            {/* OVERVIEW TAB */}
            {activeTab === "overview" && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    key="overview"
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-blue-500" /> Health Stats
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded-2xl">
                                <span className="text-2xl font-black text-blue-600 block">{history.length}</span>
                                <span className="text-xs font-bold text-blue-400 uppercase">Searches</span>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-2xl">
                                <span className="text-2xl font-black text-purple-600 block">{saved.length}</span>
                                <span className="text-xs font-bold text-purple-400 uppercase">Saved</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Settings size={18} className="text-gray-400" /> Account
                        </h3>
                        <button 
                            onClick={logout}
                            className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            Log Out
                        </button>
                    </div>
                </motion.div>
            )}

            {/* HISTORY TAB */}
            {activeTab === "history" && (
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
            )}

            {/* SAVED TAB */}
            {activeTab === "saved" && (
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
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}