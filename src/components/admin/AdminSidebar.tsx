"use client";

import { LayoutDashboard, Users, Map, Settings, LogOut, ArrowLeft, AlertTriangle, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import Link from "next/link";

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

export function AdminSidebar({ activeTab, onTabChange, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "directory", label: "Directory", icon: Map },
    { id: "safety", label: "Safety Audit", icon: ShieldAlert },
    { id: "alerts", label: "Broadcasts", icon: AlertTriangle },
    { id: "users", label: "Users", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 h-screen flex flex-col text-white fixed left-0 top-0 bottom-0 z-50">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-black tracking-tight text-white leading-tight">
            Global Health <br />
            <span className="text-blue-500 text-lg">Admin Panel</span>
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
            <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    activeTab === item.id 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" 
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
            >
                <item.icon size={18} />
                {item.label}
            </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-all">
            <ArrowLeft size={18} /> Back to App
        </Link>
        <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 text-sm font-medium rounded-xl hover:bg-red-900/20 transition-all"
        >
            <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
}
