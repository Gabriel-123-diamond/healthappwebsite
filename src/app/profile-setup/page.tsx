"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db, getDocWithRetry } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { User, Stethoscope, Sprout, Building2, UserCircle, Globe, MapPin, Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileSetup() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<{lat: number, lng: number} | null>(null);
  
  // Username check state
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    phone: "",
    countryCode: "+234",
    role: "user" 
  });

  // Protect the route
  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    const checkExisting = async () => {
      try {
        const userDoc = await getDocWithRetry(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          router.push("/");
        }
      } catch (e) {
        console.error("Error checking existing profile:", e);
      }
    };
    checkExisting();
  }, [user, loading, router]);

  // Username Availability Check
  useEffect(() => {
    const checkUsername = async () => {
      if (formData.username.length < 3) {
        setUsernameStatus("idle");
        return;
      }
      setUsernameStatus("checking");
      
      try {
        // Query by username_lowercase to ensure case-insensitive uniqueness
        const q = query(collection(db, "users"), where("username_lowercase", "==", formData.username.toLowerCase()));
        const snap = await getDocs(q);
        if (!snap.empty) {
            setUsernameStatus("taken");
        } else {
            setUsernameStatus("available");
        }
      } catch (e) {
        console.error("Username check error:", e);
        setUsernameStatus("idle");
      }
    };

    const timeoutId = setTimeout(checkUsername, 500); // 500ms debounce
    return () => clearTimeout(timeoutId);
  }, [formData.username]);

  const countries = [
    // ...
  ];

  const roles = [
    // ...
  ];

  const requestLocation = () => {
    // ...
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (usernameStatus === "taken" || usernameStatus === "checking") return;

    setIsLoading(true);
    try {
      const selectedCountry = countries.find(c => c.code === formData.countryCode);
      
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        fullName: `${formData.firstName} ${formData.lastName}`,
        username: formData.username,
        username_lowercase: formData.username.toLowerCase(), // For case-insensitive uniqueness
        phone: `${formData.countryCode} ${formData.phone}`,
        role: formData.role,
        email: user.email,
        region: selectedCountry?.region || "Unknown",
        location: locationData,
        createdAt: serverTimestamp(),
        verified: false 
      });

      router.push("/");
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-[40px] shadow-xl p-8 sm:p-12">
        <div className="mb-10 text-center">
            <h1 className="text-3xl font-black text-gray-900 mb-2">Complete Your Profile</h1>
            <p className="text-gray-500">Tell us a bit about yourself to personalize your experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide flex justify-between">
                  Basic Information
                  <button 
                    type="button" 
                    onClick={requestLocation}
                    className="text-blue-600 normal-case flex items-center gap-1 hover:underline"
                  >
                    <MapPin size={14} /> {locationData ? "Location Saved" : "Grant Location Permission"}
                  </button>
                </label>
                
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        placeholder="First Name" 
                        required
                        className="w-1/2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 font-semibold"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                    />
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        required
                        className="w-1/2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 font-semibold"
                        value={formData.lastName}
                        onChange={(e) => setFormData(prev => ({...prev, lastName: e.target.value}))}
                    />
                </div>

                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Username (unique)" 
                        required
                        minLength={3}
                        className={cn(
                            "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 font-semibold",
                            usernameStatus === "taken" && "border-red-500 focus:border-red-500",
                            usernameStatus === "available" && "border-green-500 focus:border-green-500"
                        )}
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({...prev, username: e.target.value.toLowerCase().replace(/\s/g, '')}))}
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        {usernameStatus === "checking" && <Loader2 className="animate-spin text-gray-400" size={18} />}
                        {usernameStatus === "available" && <Check className="text-green-500" size={18} />}
                        {usernameStatus === "taken" && <X className="text-red-500" size={18} />}
                    </div>
                </div>
                {usernameStatus === "taken" && <p className="text-xs text-red-500 font-bold ml-2">Username is already taken!</p>}
                
                <div className="flex gap-3">
                    <div className="relative w-1/3">
                      <select 
                        className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all text-sm font-semibold appearance-none cursor-pointer text-gray-900"
                        value={formData.countryCode}
                        onChange={(e) => setFormData(prev => ({...prev, countryCode: e.target.value}))}
                      >
                        {countries.map(c => (
                          <option key={c.name} value={c.code} className="text-gray-900">{c.code} {c.name}</option>
                        ))}
                      </select>
                      {/* Custom dropdown arrow if needed, but appearance-none + css grid is simpler */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        required
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all font-semibold text-gray-900 placeholder-gray-500"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-sm font-bold text-gray-900 uppercase tracking-wide">I am joining as a...</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => setFormData(prev => ({...prev, role: role.id}))}
                            className={cn(
                                "flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left relative overflow-hidden group",
                                formData.role === role.id 
                                    ? "border-blue-600 bg-blue-50" 
                                    : "border-gray-100 bg-white hover:border-blue-200"
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-full mb-3 transition-colors",
                                formData.role === role.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 group-hover:text-blue-600"
                            )}>
                                <role.icon size={24} />
                            </div>
                            <span className={cn(
                                "font-bold text-lg mb-1",
                                formData.role === role.id ? "text-blue-900" : "text-gray-900"
                            )}>
                                {role.label}
                            </span>
                            <span className="text-xs text-gray-500 leading-snug">
                                {role.desc}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <button 
                type="submit"
                disabled={isLoading || usernameStatus === "taken" || usernameStatus === "checking"}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
            >
                {isLoading ? "Saving Profile..." : "Complete Setup"}
            </button>
        </form>
      </div>
    </div>
  );
}