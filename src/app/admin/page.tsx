"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DirectoryManager } from "@/components/admin/DirectoryManager";
import { BroadcastManager } from "@/components/admin/BroadcastManager";
import { SafetyLogManager } from "@/components/admin/SafetyLogManager";
import { UserManager } from "@/components/admin/UserManager";
import { seedDatabase } from "@/lib/seed";
import { Database, RefreshCcw, CheckCircle2, AlertCircle, TrendingUp, Users, MapPin, Activity, Settings, ShieldAlert, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { verifyAdminPassword } from "@/app/actions/verifyAdmin";

// Fallback email for recovery
const SUPER_ADMIN_EMAIL = "gabrielpeterekerete231@gmail.com";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({ directoryCount: 0, usersCount: 0, searchesCount: 1240 });
  const [seedStatus, setSeedStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  
  // Password Gate
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else {
        checkAdminStatus();
      }
    }
  }, [user, loading, router]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    // 1. Check hardcoded super admin
    if (user.email === SUPER_ADMIN_EMAIL) {
        setIsAdmin(true);
        setCheckingRole(false);
        fetchStats();
        return;
    }

    // 2. Check Firestore role
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true);
            fetchStats();
        } else {
            setIsAdmin(false);
        }
    } catch (e) {
        console.error("Role check failed", e);
        setIsAdmin(false);
    } finally {
        setCheckingRole(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    const result = await verifyAdminPassword(passwordInput);
    if (result.success) {
        setIsPasswordVerified(true);
    } else {
        setPasswordError(result.message || "Invalid password");
    }
  };

  const fetchStats = async () => {
    try {
      const dirSnap = await getDocs(collection(db, "directory"));
      setStats(prev => ({ ...prev, directoryCount: dirSnap.size }));
      // In real app, querying all users might be expensive. Use aggregation queries or counters.
      // For now, mock or simple count.
      const usersSnap = await getDocs(collection(db, "users"));
      setStats(prev => ({ ...prev, usersCount: usersSnap.size })); 
    } catch (e) {
      console.error("Stats fetch error", e);
    }
  };

  const handleSeed = async () => {
    setSeedStatus("loading");
    setErrorMsg(null);
    try {
      const result = await seedDatabase();
      if (result.success) {
        setSeedStatus("success");
        fetchStats();
      } else {
        setSeedStatus("error");
        setErrorMsg(result.error?.message || "Unknown error");
      }
    } catch (err: any) {
      setSeedStatus("error");
      setErrorMsg(err.message);
    }
  };

  // 1. Loading State
  if (loading || checkingRole) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-400">Loading Dashboard...</div>;
  }

  // 2. Unauthenticated
  if (!user) return null;

  // 3. Unauthorized Access
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <div className="p-4 bg-red-100 text-red-600 rounded-full mb-4">
          <Lock size={48} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="text-gray-500 mt-2 max-w-md">
          You are logged in as <strong>{user.email}</strong>, but you do not have administrator privileges.
        </p>
        <button 
          onClick={() => router.push("/")}
          className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          Return to Home
        </button>
      </div>
    );
  }

  // 3.5 Password Gate
  if (!isPasswordVerified) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-gray-100">
                <div className="mx-auto w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-4">
                    <ShieldAlert size={24} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Security</h2>
                <p className="text-sm text-gray-500 mb-6">Please enter the admin password to verify your identity.</p>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="Admin Password"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-gray-900 transition-colors text-gray-900"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        autoFocus
                    />
                    {passwordError && <p className="text-red-500 text-xs font-bold">{passwordError}</p>}
                    <button 
                        type="submit"
                        className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        Verify Access
                    </button>
                </form>
            </div>
        </div>
    );
  }

  // 4. Authorized Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={() => {}} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Welcome back, {user.displayName || "Admin"}.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100">
                <ShieldAlert size={14} />
                SECURE ADMIN MODE
            </div>
        </header>

        {/* Overview Tab */}
        {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Directory Listings</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.directoryCount}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-green-50 text-green-600 rounded-2xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Active Users</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.usersCount}</h3>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-400 font-medium">Total Searches</p>
                            <h3 className="text-2xl font-bold text-gray-900">{stats.searchesCount}</h3>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Seed DB) */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-2xl">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Database Tools</h3>
                            <p className="text-sm text-gray-500">Manage initial data and configurations.</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSeed}
                        disabled={seedStatus === "loading"}
                        className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all disabled:bg-gray-300"
                    >
                        {seedStatus === "loading" ? <RefreshCcw className="animate-spin" /> : <RefreshCcw />}
                        {seedStatus === "loading" ? "Seeding Database..." : "Reset & Seed Mock Data"}
                    </button>

                    {seedStatus === "success" && (
                        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
                            <CheckCircle2 size={18} /> Database updated successfully.
                        </div>
                    )}
                    {seedStatus === "error" && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-xl">
                            <div className="flex items-center gap-2 font-bold"><AlertCircle size={18} /> Error</div>
                            <p className="text-xs mt-1 font-mono">{errorMsg}</p>
                            <p className="text-[10px] mt-2 text-red-800 font-medium">
                                Hint: Ensure you are logged in as {SUPER_ADMIN_EMAIL} and Firestore Rules allow your writes.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Directory Manager Tab */}
        {activeTab === "directory" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <DirectoryManager />
            </div>
        )}
        
        {/* User Manager Tab (New) */}
        {activeTab === "users" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <UserManager />
            </div>
        )}

        {/* Safety Audit Tab */}
        {activeTab === "safety" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <SafetyLogManager />
            </div>
        )}

        {/* Alerts / Broadcast Tab */}
        {activeTab === "alerts" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
                <BroadcastManager />
            </div>
        )}

      </main>
    </div>
  );
}
