"use client";

import { User, Shield, MapPin, Phone, Calendar, Edit2 } from "lucide-react";

interface ProfileHeaderProps {
  user: any;
  profile: any;
  onEditClick: () => void;
}

export function ProfileHeader({
  user,
  profile,
  onEditClick
}: ProfileHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 -mt-12">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-24 h-24 md:w-36 md:h-36 bg-white rounded-full p-1.5 shadow-xl">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-full object-cover bg-gray-100" />
              ) : (
                <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}
            </div>
            {profile.role === "doctor" && (
              <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full border-4 border-white shadow-sm" title="Verified Doctor">
                <Shield size={18} fill="currentColor" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 w-full md:pt-14">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-gray-900">
                  {profile.fullName || "User"}
                </h1>
                <p className="text-gray-500 font-medium">@{profile.username}</p>
              </div>

              <button
                onClick={onEditClick}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                title="Edit Profile"
              >
                <Edit2 size={20} />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                <MapPin size={14} className="text-blue-500" />
                {profile.region || "Unknown Location"}
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                <Phone size={14} className="text-green-500" />
                {profile.phone || "No Phone"}
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                <Calendar size={14} className="text-purple-500" />
                Joined {profile.createdAt?.toDate ? new Date(profile.createdAt.toDate()).getFullYear() : '2024'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}