'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { exportData, deleteAccount } from '@/services/dataService';
import { LogOut, User as UserIcon, Settings, Download, Trash2, Shield, HelpCircle, Loader2, Copy, Users as UsersIcon, BookOpen, Edit, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState({ displayName: '', phone: '' });
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/auth/signin');
      } else {
        setUser(currentUser);
        setEditFormData({ 
          displayName: currentUser.displayName || '', 
          phone: '+234 801 234 5678' // Mock phone
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  const handleSaveProfile = async () => {
    setProcessing(true);
    // Mock save
    await new Promise(r => setTimeout(r, 1000));
    setIsEditing(false);
    setProcessing(false);
    alert('Profile updated successfully!');
  };

  const handleExport = async () => {
    setProcessing(true);
    try {
      await exportData();
    } catch (error) {
      console.error(error);
      alert('Failed to export data');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    
    setProcessing(true);
    try {
      await deleteAccount();
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error(error);
      alert('Failed to delete account');
    } finally {
      setProcessing(false);
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
        
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center relative group"
        >
          <button 
            onClick={() => setIsEditing(true)}
            className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
            title="Edit Profile"
          >
            <Edit className="w-5 h-5" />
          </button>

          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4 border-4 border-white shadow-lg text-4xl font-bold">
            {user.email?.[0].toUpperCase() || <UserIcon className="w-10 h-10" />}
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{user.displayName || 'HealthAI User'}</h1>
          <p className="text-slate-500">{user.email}</p>
        </motion.div>

        {/* Edit Modal */}
        <AnimatePresence>
          {isEditing && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsEditing(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900">Edit Profile</h2>
                    <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <X className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Full Name</label>
                      <div className="relative">
                        <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="text" 
                          value={editFormData.displayName}
                          onChange={(e) => setEditFormData({...editFormData, displayName: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1 tracking-widest">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input 
                          type="tel" 
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400"
                          placeholder="+234 ..."
                        />
                      </div>
                    </div>

                    <button 
                      onClick={handleSaveProfile}
                      disabled={processing}
                      className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-2 disabled:bg-slate-200"
                    >
                      {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg text-white hover:scale-[1.02] transition-transform cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <UsersIcon className="w-5 h-5 text-white" />
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-sm">
                Level 1
              </span>
            </div>
            <h3 className="text-2xl font-bold mb-1">250 Points</h3>
            <p className="text-indigo-100 text-sm mb-6">Earn rewards by inviting friends.</p>
            
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-200 uppercase tracking-wider font-bold">Your Code</p>
                <p className="font-mono font-bold tracking-widest">HEALTH25</p>
              </div>
              <button 
                onClick={() => {navigator.clipboard.writeText('HEALTH25'); alert('Code copied!')}}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleExport}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              {processing ? <Loader2 className="w-5 h-5 animate-spin"/> : <Download className="w-5 h-5" />}
            </div>
            <h3 className="font-bold text-slate-900 mb-1">{t.profile.exportData}</h3>
            <p className="text-sm text-slate-500">Download a copy of your health data.</p>
          </motion.div>
        </div>

        {/* My Learning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              < BookOpen className="w-5 h-5 text-blue-600" />
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

        {/* Menu List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        >
          <div className="divide-y divide-slate-100">
             <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
              <Shield className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">{t.profile.privacy}</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left">
              <HelpCircle className="w-5 h-5 text-slate-400" />
              <span className="font-medium text-slate-700">{t.profile.help}</span>
            </button>
            <button 
              onClick={handleDelete}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors text-left text-red-600"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-medium">{t.profile.deleteAccount}</span>
            </button>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors text-left text-slate-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t.profile.signOut}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}