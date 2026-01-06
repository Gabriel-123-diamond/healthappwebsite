"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db, getDocWithRetry } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getSearchHistory, getSavedResources, SearchHistoryItem, SavedResource } from "@/lib/user-service";
import { AnimatePresence } from "framer-motion";

// Components
import { ProfileHeader } from "@/components/features/profile/ProfileHeader";
import { ProfileTabs } from "@/components/features/profile/ProfileTabs";
import { OverviewTab } from "@/components/features/profile/OverviewTab";
import { HistoryTab } from "@/components/features/profile/HistoryTab";
import { SavedTab } from "@/components/features/profile/SavedTab";
import { EditProfileModal } from "@/components/features/profile/EditProfileModal";

export default function ProfilePage() {
  const { user, loading, logout, linkGoogle } = useAuth();
  const router = useRouter();
  
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);
  const [saved, setSaved] = useState<SavedResource[]>([]);
  
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "saved">("overview");
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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
        const docSnap = await getDocWithRetry(doc(db, "users", user.uid));
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          router.push("/profile-setup");
        }

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

  const handleUpdatePhone = async (newPhone: string) => {
    if (!user) return;
    try {
        await updateDoc(doc(db, "users", user.uid), { phone: newPhone });
        setProfile((prev: any) => ({ ...prev, phone: newPhone }));
    } catch (e) {
        console.error("Failed to update phone", e);
        throw e; // Re-throw so modal knows it failed
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
        onEditClick={() => setIsEditModalOpen(true)}
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

      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentPhone={profile.phone}
        onSave={handleUpdatePhone}
        userId={user?.uid || ""}
      />
    </div>
  );
}