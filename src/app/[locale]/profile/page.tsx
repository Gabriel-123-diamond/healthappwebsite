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
            // Check if onboarding is complete
            if (profile.onboardingComplete !== true) {
              router.push('/onboarding');
              return;
            }

            setUserProfile(profile);
            setEditFormData({ 
              displayName: profile.fullName || currentUser.displayName || '', 
              phone: profile.phone || '' 
            });
          } else {
            // No profile found in Firestore, redirect to onboarding
            router.push('/onboarding');
            return;
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
      await userService.updateProfile(user.uid, {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const courses = [
    { title: 'Managing Hypertension', progress: 35, color: 'bg-blue-600' },
    { title: 'Sleep Hygiene Masterclass', progress: 80, color: 'bg-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 sm:pt-32 pb-24 relative overflow-hidden">
      {/* Theme Magic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-400/5 dark:bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-400/5 dark:bg-indigo-600/5 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-10">
            <ProfileHeader 
              user={user} 
              userProfile={userProfile}
              onEdit={() => setIsEditing(true)} 
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
              className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[48px] shadow-3xl shadow-blue-900/5 border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20 text-white">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                    {t.profile.myLearning}
                  </h3>
                </div>
                <Link href="/learning" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition-colors">
                  {t.profile.viewAll}
                </Link>
              </div>
              
              <div className="space-y-8">
                {courses.length > 0 ? courses.map((course, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-slate-900 dark:text-white text-base group-hover:text-blue-600 transition-colors tracking-tight">{course.title}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{course.progress}% Complete</span>
                    </div>
                    <div className="h-3 bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-100 dark:border-slate-700/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (i * 0.1) }}
                        className={`h-full ${course.color} rounded-full shadow-lg shadow-blue-500/20`}
                      />
                    </div>
                  </div>
                )) : (
                  <div className="py-16 text-center bg-slate-50 dark:bg-slate-950/50 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Intelligence gap detected</p>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Initialize your first learning path.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-32">
              <ProfileMenu t={t} userProfile={userProfile} />
            </div>
          </aside>
        </div>

        <EditProfileModal 
          isOpen={isEditing} 
          onClose={() => setIsEditing(false)} 
          initialData={editFormData}
          onSave={handleSaveProfile}
        />
      </div>
    </div>
  );
}