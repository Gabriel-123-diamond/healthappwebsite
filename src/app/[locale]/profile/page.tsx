'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { referralService } from '@/services/referralService';
import { getRedirectPath } from '@/lib/authUtils';
import { userService } from '@/services/userService';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileStats from '@/components/profile/ProfileStats';
import { IntelligenceDiscovery } from '@/components/profile/IntelligenceDiscovery';
import { WellnessRoadmap } from '@/components/profile/WellnessRoadmap';
import { RoadmapAiPlanner } from '@/components/profile/RoadmapAiPlanner';
import { FamilyVaultWidget } from '@/components/profile/FamilyVaultWidget';
import ProfileMenu from '@/components/profile/ProfileMenu';
import EditProfileModal from '@/components/profile/EditProfileModal';
import NiceModal from '@/components/common/NiceModal';
import { ProfileStatusCard } from '@/components/profile/ProfileStatusCard';
import { ProfileBackground } from '@/components/profile/ProfileBackground';
import { ProfileLoading } from '@/components/profile/ProfileLoading';
import { useLearning } from '@/hooks/useLearning';
import { ProfileCommunitySection } from './components/ProfileCommunitySection';
import { useConfettiUpgrade } from './hooks/useConfettiUpgrade';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [referralCode, setReferralCode] = useState<string>('...');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ 
    displayName: '', 
    phone: '',
    phones: [] as any[]
  });
  const { enrolledPaths } = useLearning();
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type: 'success' | 'warning' | 'info';
    cancelText?: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    type: 'info'
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('profile');

  const showAlert = (title: string, description: string, type: 'info' | 'warning' | 'success' = 'info', cancelText: string = "Cancel") => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type,
      cancelText
    });
  };

  useConfettiUpgrade(searchParams, showAlert);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin');
      } else {
        setUser(currentUser);
        
        try {
          const profile = await userService.getUserProfile(currentUser.uid);
          if (profile) {
            if (profile.role && profile.role !== 'user') {
              const redirectPath = await getRedirectPath(currentUser.uid);
              router.push(redirectPath);
              return;
            }

            if (profile.onboardingComplete !== true) {
              router.push('/onboarding');
              return;
            }

            setUserProfile(profile);
            
            const initialPhones = profile.phones || (profile.phone ? [{ 
              number: profile.phone.replace(profile.countryCode || '', ''), 
              code: profile.countryCode || '+234', 
              label: 'Primary',
              isVerified: true
            }] : []);

            setEditFormData({ 
              displayName: profile.fullName || currentUser.displayName || '', 
              phone: profile.phone || '',
              phones: initialPhones
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

  const handleSaveProfile = async (data: { displayName: string; phone: string; phones: any[] }) => {
    if (!user) return;
    try {
      const primaryPhone = data.phones.length > 0 
        ? `${data.phones[0].code}${data.phones[0].number.replace(/\s/g, '')}`
        : data.phone;

      await userService.updateProfile(user.uid, {
        fullName: data.displayName,
        phone: primaryPhone,
        phones: data.phones
      });
      setEditFormData(data);
      setUserProfile((prev: any) => ({ 
        ...prev, 
        fullName: data.displayName, 
        phone: primaryPhone,
        phones: data.phones
      }));
      showAlert('Profile Updated', 'Your profile has been updated successfully!', 'success');
    } catch (error) {
      showAlert('Update Failed', 'We could not update your profile. Please try again.', 'warning');
    }
  };

  if (loading) {
    return <ProfileLoading />;
  }

  if (!user) return null;

  const displayCourses = enrolledPaths.slice(0, 2).map((path, i) => ({
    title: path.title,
    progress: path.progress || 0,
    color: i % 2 === 0 ? 'bg-blue-600' : 'bg-indigo-600'
  }));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-32 relative overflow-hidden">
      <ProfileBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 md:gap-8 lg:gap-12 items-start">

          {/* Main Content Area */}
          <div className="w-full lg:col-span-8 flex flex-col gap-6 md:gap-10 lg:gap-16 order-1">

            {/* Profile Section */}
            <ProfileHeader 
              user={user} 
              userProfile={userProfile}
              onEdit={() => setIsEditing(true)} 
            />

            {/* Statistics Section */}
            <div className="w-full">
              <ProfileStats 
                user={user}
                userProfile={userProfile}
                referralCode={referralCode}
                setReferralCode={setReferralCode}
                t={t}
              />
            </div>

            {/* Wellness Roadmap Section */}
            <div className="w-full">
              <WellnessRoadmap />
            </div>

            {/* AI Roadmap Planner Section */}
            <div className="w-full">
              <RoadmapAiPlanner />
            </div>

            {/* Family Vault Section */}
            <div className="w-full">
              <FamilyVaultWidget />
            </div>

            {/* Community Feed Section */}
            <ProfileCommunitySection interests={userProfile?.interests} />

            {/* Learning Section */}
            <div className="w-full">
              <IntelligenceDiscovery t={t} courses={displayCourses} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:col-span-4 space-y-6 order-2 lg:sticky lg:top-24 lg:-mt-12">
            <div className="w-full">
              <ProfileMenu userProfile={userProfile} />
            </div>

            <ProfileStatusCard />
          </aside>

        </div>
      </div>
      <EditProfileModal 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        initialData={editFormData}
        onSave={handleSaveProfile}
      />

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        cancelText={modalConfig.cancelText}
        confirmText="Got it"
      />
    </div>
  );
}
