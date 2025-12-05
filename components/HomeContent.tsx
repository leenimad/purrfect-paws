'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Cat } from '../types';
import Link from 'next/link';

// Import our existing components
import CatList from './CatList';
import ContactForm from './ContactForm';

interface HomeContentProps {
  initialCats: Cat[];
}

export default function HomeContent({ initialCats }: HomeContentProps) {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Define Admin Email
  const ADMIN_EMAIL = 'leeni.batta@gmail.com';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-brand-purple font-bold">Loading Purrfect Paws...</div>;
  }

  // ----------------------------------------------------
  // VIEW 1: THE ADMIN DASHBOARD (The "Manager" View)
  // ----------------------------------------------------
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Admin Hero */}
        <div className="bg-red-600 text-white py-20 px-4 text-center rounded-b-[3rem] shadow-xl mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">Shelter Command Center</h1>
            <p className="text-xl text-red-100 opacity-90">Welcome back, Boss. Here is what is happening today.</p>
        </div>

        <div className="container mx-auto px-4 max-w-5xl">
            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <span className="text-4xl mb-2">🐱</span>
                    <h3 className="text-gray-500 font-bold uppercase text-sm">Total Cats</h3>
                    <p className="text-4xl font-extrabold text-gray-800">{initialCats.length}</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <span className="text-4xl mb-2">📝</span>
                    <h3 className="text-gray-500 font-bold uppercase text-sm">Manage</h3>
                    <p className="text-lg font-bold text-brand-purple mt-2">Applications</p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <span className="text-4xl mb-2">⚙️</span>
                    <h3 className="text-gray-500 font-bold uppercase text-sm">System</h3>
                    <p className="text-lg font-bold text-green-600 mt-2">Operational</p>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <Link href="/admin" className="group bg-white p-8 rounded-2xl shadow-md border-l-8 border-brand-purple hover:shadow-xl transition-all">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-brand-purple transition-colors">Go to Admin Panel &rarr;</h3>
                    <p className="text-gray-500 mt-2">Review adoption applications and update cat statuses.</p>
                </Link>
                
                <Link href="/admin/add" className="group bg-white p-8 rounded-2xl shadow-md border-l-8 border-green-500 hover:shadow-xl transition-all">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">Add a New Cat &rarr;</h3>
                    <p className="text-gray-500 mt-2">Upload photos and details for a new rescue.</p>
                </Link>
            </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // VIEW 2: THE ADOPTER VIEW (User or Guest)
  // ----------------------------------------------------
  return (
    <div className="space-y-24 pb-24">
      
      {/* Dynamic Hero */}
      <section className="text-center py-12 bg-brand-purple-light/20 rounded-3xl mx-4 mt-4">
        {user ? (
            <>
                <h1 className="text-5xl font-extrabold text-brand-purple-dark">
                    Welcome back, {user.user_metadata?.full_name?.split(' ')[0] || 'Friend'}!
                </h1>
                <p className="mt-4 text-xl text-gray-600">Your future best friend is waiting below.</p>
                <div className="mt-8">
                     <Link href="/dashboard" className="bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-purple-dark transition">
                        Check My Applications
                    </Link>
                </div>
            </>
        ) : (
            <>
                <h1 className="text-5xl md:text-7xl font-extrabold text-brand-purple-dark tracking-tighter">
                    Your Purrfect<br/>Companion Awaits.
                </h1>
                <p className="mt-4 max-w-lg mx-auto text-xl text-gray-600">
                    Discover adorable, healthy, and playful cats ready to bring joy to your home.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Link href="/signup" className="bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-purple-dark transition shadow-lg">
                        Join Us
                    </Link>
                    <Link href="#available-cats" className="bg-white text-brand-purple border-2 border-brand-purple font-bold px-8 py-3 rounded-xl hover:bg-brand-purple-light transition">
                        Browse Cats
                    </Link>
                </div>
            </>
        )}
      </section>

      {/* How It Works (Adopters ONLY) */}
      <section id="how-it-works" className="text-center container mx-auto px-4 pt-32">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">A Simple Path to Adoption</h2>
        <p className="mt-2 text-lg text-gray-500">Three easy steps to bring home your new family member.</p>
        <div className="mt-12 grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center items-center h-20 w-20 mx-auto bg-brand-purple-light rounded-full mb-6 text-3xl">🔍</div>
                <h3 className="text-xl font-bold">1. Find a Friend</h3>
                <p className="mt-2 text-gray-500 text-sm">Browse our gallery to find your match.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center items-center h-20 w-20 mx-auto bg-brand-purple-light rounded-full mb-6 text-3xl">📝</div>
                <h3 className="text-xl font-bold">2. Apply Online</h3>
                <p className="mt-2 text-gray-500 text-sm">Fill out our quick and secure form.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-center items-center h-20 w-20 mx-auto bg-brand-purple-light rounded-full mb-6 text-3xl">🏠</div>
                <h3 className="text-xl font-bold">3. Welcome Home</h3>
                <p className="mt-2 text-gray-500 text-sm">Schedule a pickup and welcome them home.</p>
            </div>
        </div>
      </section>

      {/* Cat List (Adopters ONLY) */}
      <CatList cats={initialCats} />

      {/* Contact Form (Adopters ONLY)
      <div className="pt-10 border-t border-gray-200 container mx-auto px-4">
        <ContactForm />
      </div> */}

    </div>
  );
}