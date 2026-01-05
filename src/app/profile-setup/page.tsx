"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db, getDocWithRetry } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Stethoscope, Sprout, Building2, UserCircle, Globe, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProfileSetup() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [locationData, setLocationData] = useState<{lat: number, lng: number} | null>(null);
  
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

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    countryCode: "+234",
    role: "user" 
  });

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
        // On web, geocoding usually requires an API key or a library. 
        // We'll store the raw coords and the selected country region.
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

    setIsLoading(true);
    try {
      const selectedCountry = countries.find(c => c.code === formData.countryCode);
      
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
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
                <input 
                    type="text" 
                    placeholder="Full Name" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-blue-500 transition-all"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
                
                <div className="flex gap-2">
                    <select 
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-3 py-3 outline-none focus:border-blue-500 transition-all w-1/3 text-sm"
                      value={formData.countryCode}
                      onChange={(e) => setFormData({...formData, countryCode: e.target.value})}
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
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                            onClick={() => setFormData({...formData, role: role.id})}
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
                disabled={isLoading}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98] disabled:bg-gray-400"
            >
                {isLoading ? "Saving Profile..." : "Complete Setup"}
            </button>
        </form>
      </div>
    </div>
  );
}