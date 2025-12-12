'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form States
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Password States
  const [currentPassword, setCurrentPassword] = useState(''); // NEW FIELD
  const [newPassword, setNewPassword] = useState('');

  // 1. Fetch User Data
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setEmail(user.email || '');
      setFullName(user.user_metadata?.full_name || '');
      setLoading(false);
    };
    getUser();
  }, [router]);

  // 2. Update Profile Name
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  // 3. Update Password (WITH SECURITY CHECK)
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMessage({ text: '', type: '' });

    try {
      // SECURITY STEP: Verify Old Password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword
      });

      if (signInError) {
        throw new Error("Current password is incorrect.");
      }

      // If we are here, the old password was correct. Now update.
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      setMessage({ text: 'Password updated successfully!', type: 'success' });
      
      // Clear fields
      setCurrentPassword('');
      setNewPassword('');
      
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-brand-purple font-bold">Loading Settings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Account Settings</h1>

        {/* Notification Message */}
        {message.text && (
            <div className={`p-4 mb-6 rounded-xl font-bold text-center ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message.text}
            </div>
        )}

        {/* CARD 1: Personal Information */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                👤 Personal Details
            </h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold text-gray-500 mb-1">Email Address</label>
                    <input type="text" value={email} disabled className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                    <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" 
                    />
                </div>
                <button disabled={updating} className="bg-brand-purple text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-purple-dark transition disabled:opacity-50">
                    Save Changes
                </button>
            </form>
        </div>

        {/* CARD 2: Security */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🔒 Security
            </h2>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
                
                {/* CURRENT PASSWORD FIELD */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Current Password</label>
                    <input 
                        type="password" 
                        value={currentPassword} 
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" 
                        required
                    />
                </div>

                {/* NEW PASSWORD FIELD */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">New Password</label>
                    <input 
                        type="password" 
                        value={newPassword} 
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" 
                        required
                        minLength={6}
                    />
                </div>

                <button disabled={updating} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-bold hover:bg-black transition disabled:opacity-50">
                    {updating ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>

      </div>
    </div>
  );
}