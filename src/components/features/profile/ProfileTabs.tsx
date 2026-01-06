"use client";

import { Activity, History, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileTabsProps {
  activeTab: "overview" | "history" | "saved";
  setActiveTab: (tab: "overview" | "history" | "saved") => void;
}

export function ProfileTabs({ activeTab, setActiveTab }: ProfileTabsProps) {
  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "history", label: "Search History", icon: History },
    { id: "saved", label: "Saved Items", icon: Bookmark },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 flex gap-8 border-t border-gray-100 mt-2 bg-white">
      {tabs.map((tab) => (
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
  );
}