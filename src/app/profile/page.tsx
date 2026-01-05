"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db, getDocWithRetry } from "@/lib/firebase";
import { doc } from "firebase/firestore";
import { User, MapPin, Phone, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const docSnap = await getDocWithRetry(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          router.push("/profile-setup");
        }
      } catch (e) {
        console.error("Error fetching profile", e);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user, loading, router]);

  if (loading || isLoadingProfile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading Profile...</div>;
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 h-32 relative">
            <div className="absolute -bottom-10 left-8">
                <div className="w-20 h-20 bg-white rounded-full p-1 shadow-lg">
                    <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User size={40} />
                    </div>
                </div>
            </div>
        </div>
        
        <div className="pt-12 pb-8 px-8">
            <h1 className="text-2xl font-black text-gray-900">{profile.fullName || profile.firstName}</h1>
            <p className="text-gray-500 font-medium">@{profile.username || "user"}</p>
            
            <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Shield size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Role</p>
                        <p className="font-semibold capitalize">{profile.role}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                        <Phone size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Phone</p>
                        <p className="font-semibold">{profile.phone}</p>
                    </div>
                </div>

                {profile.region && (
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
                            <MapPin size={16} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase">Region</p>
                            <p className="font-semibold">{profile.region}</p>
                        </div>
                    </div>
                )}
                
                <div className="flex items-center gap-3 text-gray-600">
                    <div className="w-8 h-8 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center">
                        <Calendar size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Joined</p>
                        <p className="font-semibold">
                            {profile.createdAt?.toDate ? new Date(profile.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}