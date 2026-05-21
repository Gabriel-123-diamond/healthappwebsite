'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, ArrowLeft, Loader2, Shield
} from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing';
import { auth, db } from '@/lib/firebase';
import { userService } from '@/services/userService';
import { familyService, FamilyInvite } from '@/services/familyService';
import { UserProfile } from '@/types/user';
import NiceModal from '@/components/common/NiceModal';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  FamilyLockedState, FamilyMemberCard, PendingInviteItem, FamilyInviteForm 
} from '@/components/family/FamilyComponents';

export default function FamilyNodePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [members, setFamilyMembers] = useState<UserProfile[]>([]);
  const [invites, setInvites] = useState<FamilyInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const router = useRouter();

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

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push('/');
        return;
      }

      try {
        const userProfile = await userService.getUserProfile(user.uid);
        setProfile(userProfile);

        if (userProfile?.tier === 'vip2' || userProfile?.tier === 'premium') {
          const membersList = await familyService.getFamilyMembers();
          setFamilyMembers(membersList);

          // Setup real-time listener for invites
          const invitesRef = collection(db, 'family_invites');
          const q = query(invitesRef, where('senderId', '==', user.uid), where('status', '==', 'pending'));
          
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const pendingInvites = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FamilyInvite));
            setInvites(pendingInvites);
          });

          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Failed to fetch family data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      await familyService.sendInvite(inviteEmail);
      setInviteEmail('');
      setModalConfig({
        isOpen: true,
        title: "Invitation Sent",
        description: `Invite sent to ${inviteEmail}. They will appear in your account once they accept.`,
        type: 'success'
      });
    } catch (error: any) {
      setModalConfig({
        isOpen: true,
        title: "Account Full",
        description: error.message || "Failed to send invitation.",
        type: 'warning'
      });
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberUid: string) => {
    try {
      await familyService.removeMember(memberUid);
      setFamilyMembers(members.filter(m => m.uid !== memberUid));
    } catch (error) {
      console.error("Remove member failed:", error);
    }
  };

  const isElite = profile?.tier === 'vip2' || profile?.tier === 'premium';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isElite) {
    return <FamilyLockedState />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-32 sm:pt-40 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <Link href="/profile" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-2">
              <ArrowLeft size={12} /> Dashboard
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                <Users size={24} />
              </div>
              <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                Family <span className="text-blue-600">Sharing.</span>
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
              Linked accounts share health records and insights. Manage your family members and invitations here.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Available Slots</p>
              <p className="text-lg font-black text-slate-900 dark:text-white">{(profile?.familySlots || 4) - members.length}</p>
            </div>
            <div className="w-px h-8 bg-slate-100 dark:bg-white/10" />
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600">
              <Shield size={18} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Active Members */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
              Active Members <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 text-[10px]">{members.length}</span>
            </h3>
            
            {members.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-white/5 p-12 text-center">
                <p className="text-slate-400 font-medium text-sm">No family members linked to this account yet.</p>
              </div>

            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => (
                  <FamilyMemberCard key={member.uid} member={member} onRemove={handleRemoveMember} />
                ))}
              </div>
            )}

            {/* Pending Invites */}
            {invites.length > 0 && (
              <div className="pt-8 space-y-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2 text-amber-500">
                  Pending Invites <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-[10px]">{invites.length}</span>
                </h3>
                <div className="space-y-3">
                  {invites.map((invite) => (
                    <PendingInviteItem key={invite.id} invite={invite} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <FamilyInviteForm 
            inviteEmail={inviteEmail} 
            setInviteEmail={setInviteEmail} 
            onInvite={handleSendInvite} 
            inviting={inviting} 
          />
        </div>
      </div>

      <NiceModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
      />
    </div>
  );
}
