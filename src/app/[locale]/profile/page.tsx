'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { BookOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileMenu from '@/components/profile/ProfileMenu';
import EditProfileModal from '@/components/profile/EditProfileModal';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [referralCode, setReferralCode] = useState<string>('...');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ displayName: '', phone: '' });
  
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin');
      } else {
        setUser(currentUser);
        
        try {
          const profile = await userService.getUserProfile(currentUser.uid);
          if (profile) {
            setUserProfile(profile);
            setEditFormData({ 
              displayName: profile.fullName || currentUser.displayName || '', 
              phone: profile.phone || '' 
            });
          }

          const code = await referralService.getExistingReferralCode(currentUser.uid);
          setReferralCode(code || 'NO CODE');
        } catch (error) {
          console.error("Error loading profile data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSaveProfile = async (data: { displayName: string; phone: string }) => {
    if (!user) return;
    try {
      await userService.updateUserProfile(user.uid, {
        fullName: data.displayName,
        phone: data.phone
      });
      setEditFormData(data);
      // Refresh profile data locally or re-fetch
      setUserProfile((prev: any) => ({ ...prev, fullName: data.displayName, phone: data.phone }));
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <ProfileHeader 
          user={user} 
          onEdit={() => setIsEditing(true)} 
        />

        <EditProfileModal 
          isOpen={isEditing} 
          onClose={() => setIsEditing(false)} 
          initialData={editFormData}
          onSave={handleSaveProfile}
        />

        <ProfileStats 
          user={user}
          userProfile={userProfile}
          referralCode={referralCode}
          setReferralCode={setReferralCode}
          t={t}
        />

        {/* My Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              {t.profile.myLearning}
            </h3>
            <Link href="/learning" className="text-sm text-blue-600 hover:underline font-medium">
              {t.profile.viewAll}
            </Link>
          </div>
          
          <div className="space-y-4">
            {[
              { title: 'Managing Hypertension', progress: 35, color: 'bg-blue-600' },
              { title: 'Sleep Hygiene Masterclass', progress: 80, color: 'bg-purple-600' }
            ].map((course, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-slate-700 group-hover:text-blue-600 transition-colors">{course.title}</span>
                  <span className="text-slate-500">{course.progress}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${course.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <ProfileMenu t={t} />
      </div>
    </div>
  );
}