'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { referralService } from '@/services/referralService';
import { userService } from '@/services/userService';
import { BookOpen, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import ProfileMenu from '@/components/profile/ProfileMenu';
import EditProfileModal from '@/components/profile/EditProfileModal';
import NiceModal from '@/components/common/NiceModal';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [referralCode, setReferralCode] = useState<string>('...');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ displayName: '', phone: '' });
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });
  
  const router = useRouter();
  const t = useTranslations('profile');

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info') => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin');
      } else {
        setUser(currentUser);
        
        try {
          const profile = await userService.getUserProfile(currentUser.uid);
          if (profile) {
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
      setUserProfile((prev: any) => ({ ...prev, fullName: data.displayName, phone: data.phone }));
      showAlert('Profile Updated', 'Your profile has been updated successfully!', 'success');
    } catch (error) {
      showAlert('Update Failed', 'We could not update your profile. Please try again.', 'warning');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-[9px]">{t('syncingIdentity')}</p>
      </div>
    );
  }

  if (!user) return null;

  const courses = [
    { title: 'Managing Hypertension', progress: 35, color: 'bg-blue-600' },
    { title: 'Sleep Hygiene Masterclass', progress: 80, color: 'bg-indigo-600' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-32 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 space-y-8">
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

            {/* My Learning Section - Compacted */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-[#0B1221] p-6 sm:p-8 rounded-[32px] shadow-xl border border-slate-100 dark:border-white/5"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-600 rounded-xl text-white">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{t('intelligence')}</h3>
                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{t('knowledgeStream')}</p>
                  </div>
                </div>
                <Link href="/learning" className="text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1">
                  {t('explore')} <ChevronRight size={12} />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {courses.map((course, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start gap-3 mb-4">
                      <span className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{course.title}</span>
                      <Sparkles size={12} className="text-blue-500 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">
                      <span>{t('progress')}</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                        className={`h-full ${course.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <aside className="lg:col-span-4 sticky top-24">
            <ProfileMenu t={t} userProfile={userProfile} />
          </aside>
        </div>

        <EditProfileModal 
          isOpen={isEditing} 
          onClose={() => setIsEditing(false)} 
          initialData={editFormData}
          onSave={handleSaveProfile}
        />
      </div>

      <NiceModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText="Got it"
      />
    </div>
  );
}
