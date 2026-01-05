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
        const q = query(collection(db, "users"), where("username", "==", formData.username));
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
    { name: 'Nigeria', code: '+234', region: 'West Africa' },
    { name: 'Ghana', code: '+233', region: 'West Africa' },
    { name: 'Senegal', code: '+221', region: 'West Africa' },
    { name: 'Ivory Coast', code: '+225', region: 'West Africa' },
    { name: 'Benin', code: '+229', region: 'West Africa' },
    { name: 'USA', code: '+1', region: 'America' },
    { name: 'Canada', code: '+1', region: 'America' },
    { name: 'UK', code: '+44', region: 'Europe' },
    { name: 'France', code: '+33', region: 'Europe' },
    { name: 'Germany', code: '+49', region: 'Europe' },
    { name: 'UAE', code: '+971', region: 'Middle East' },
    { name: 'Saudi Arabia', code: '+966', region: 'Middle East' },
    { name: 'Australia', code: '+61', region: 'Australia' },
    { name: 'New Zealand', code: '+64', region: 'Australia' },
    { name: 'Fiji', code: '+679', region: 'Australia' },
  ];

  const roles = [
    { id: "user", label: "General User", icon: UserCircle, desc: "I am looking for health information." },
    { id: "doctor", label: "Doctor", icon: Stethoscope, desc: "I am a verified medical professional." },
    { id: "specialist", label: "Specialist", icon: Stethoscope, desc: "I am a specialist in a specific field." },
    { id: "herbalist", label: "Herbalist", icon: Sprout, desc: "I am a traditional medicine practitioner." },
    { id: "hospital", label: "Hospital", icon: Building2, desc: "I represent a healthcare facility." },
  ];

  const requestLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error("Location error:", error);
        alert("Permission denied. We will use your selected country for region filtering.");
      }
    );
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
        fullName: `${formData.firstName} ${formData.lastName}`, // Keep for backward compatibility
        username: formData.username,
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
                        className="w-1/2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
                        value={formData.firstName}
                        onChange={(e) => setFormData(prev => ({...prev, firstName: e.target.value}))}
                    />
                    <input 
                        type="text" 
                        placeholder="Last Name" 
                        required
                        className="w-1/2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
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
                            "w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all",
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
                
                <div className="flex gap-2">
                    <select 
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 outline-none focus:border-blue-500 transition-all w-1/3 text-sm"
                      value={formData.countryCode}
                      onChange={(e) => setFormData(prev => ({...prev, countryCode: e.target.value}))}
                    >
                      {countries.map(c => (
                        <option key={c.name} value={c.code}>{c.code} ({c.name})</option>
                      ))}
                    </select>
                    <input 
                        type="tel" 
                        placeholder="Phone Number" 
                        required
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
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