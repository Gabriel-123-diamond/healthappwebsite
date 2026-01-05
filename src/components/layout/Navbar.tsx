"use client";

import { usePathname, useRouter } from "next/navigation";
import { Search, Map, ShieldAlert, User as UserIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navItems = [
    { label: "Search", icon: Search, href: "/" },
    { label: "Directory", icon: Map, href: "/directory" },
  ];

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className="hidden md:flex items-center justify-between px-8 py-4 bg-white border-b fixed top-0 left-0 right-0 z-50 h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
          <div className="p-1.5 bg-blue-600 text-white rounded-lg">
            <ShieldAlert size={20} />
          </div>
          <span className="font-bold text-gray-900 text-lg tracking-tight">Health<span className="text-blue-600">AI</span></span>
        </div>

        <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  isActive
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-900"
                )}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="w-[150px] flex justify-end">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                 {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="w-8 h-8 rounded-full border border-gray-200" />
                 ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <UserIcon size={16} />
                    </div>
                 )}
                 <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">{user.displayName?.split(" ")[0]}</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 p-1 animate-in fade-in slide-in-from-top-2">
                    <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                        Admin Panel
                    </Link>
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
              )}
            </div>
          ) : (
            <Link 
                href="/login" 
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
                Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 w-full h-full justify-center active:scale-95 transition-transform",
                  isActive ? "text-blue-600" : "text-gray-400"
                )}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
          <Link
             href={user ? "/admin" : "/login"}
             className={cn(
               "flex flex-col items-center gap-1 w-full h-full justify-center active:scale-95 transition-transform",
               pathname === "/login" ? "text-blue-600" : "text-gray-400"
             )}
          >
             {user ? (
                 user.photoURL ? 
                 <img src={user.photoURL} className="w-6 h-6 rounded-full border border-gray-200" /> :
                 <UserIcon size={24} />
             ) : (
                <UserIcon size={24} />
             )}
             <span className="text-[10px] font-medium">{user ? "Profile" : "Sign In"}</span>
          </Link>
        </div>
      </nav>
    </>
  );
}