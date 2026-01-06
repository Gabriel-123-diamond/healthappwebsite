"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db, getDocWithRetry } from "@/lib/firebase";
import { doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { getSearchHistory, getSavedResources, SearchHistoryItem, SavedResource } from "@/lib/user-service";
import { AnimatePresence } from "framer-motion";

// Components
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ProfileTabs } from "@/components/features/profile/ProfileTabs";
import { OverviewTab } from "@/components/features/profile/OverviewTab";
import { HistoryTab } from "@/components/features/profile/HistoryTab";
import { SavedTab } from "@/components/features/profile/SavedTab";

export default function ProfilePage() {
  const { user, loading, logout, linkGoogle } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [saved, setSaved] = useState<SavedResource[]>([]);
  
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "saved">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [phoneStatus, setPhoneStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [linkingStatus, setLinkingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const isGoogleLinked = !!user?.providerData.some((p: any) => p.providerId === "google.com");

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
        const q = query(collection(db, "users"), where("phone", "==", editForm.phone));
        const snap = await getDocs(q);
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

  const handleGoogleLink = async () => {
    setLinkingStatus("loading");
    try {
        await linkGoogle();
        setLinkingStatus("success");
        setTimeout(() => setLinkingStatus("idle"), 3000);
    } catch (e) {
        console.error("Link failed", e);
        setLinkingStatus("error");
        setTimeout(() => setLinkingStatus("idle"), 3000);
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
      <ProfileHeader 
        user={user} 
        profile={profile} 
        isEditing={isEditing} 
        setIsEditing={setIsEditing} 
        editForm={editForm} 
        setEditForm={setEditForm} 
        handleSave={handleSave} 
        isSaving={isSaving} 
        phoneStatus={phoneStatus} 
      />

      <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="max-w-5xl mx-auto p-6">
        <AnimatePresence mode="wait">
            {activeTab === "overview" && (
                <OverviewTab 
                    historyCount={history.length} 
                    savedCount={saved.length} 
                    logout={logout}
                    isGoogleLinked={isGoogleLinked}
                    linkingStatus={linkingStatus}
                    handleGoogleLink={handleGoogleLink}
                />
            )}

            {activeTab === "history" && <HistoryTab history={history} />}

            {activeTab === "saved" && <SavedTab saved={saved} />}
        </AnimatePresence>
      </div>
    </div>
  );
}