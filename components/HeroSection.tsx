'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
export default function HeroSection() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user?.email === 'leeni.batta@gmail.com') setIsAdmin(true);
    };
    getUser();
  }, []);

  // 1. ADMIN VIEW
  if (isAdmin) {
    return (
      <section className="text-center bg-red-50 rounded-3xl p-12 border-2 border-red-100">
        <h1 className="text-5xl font-extrabold text-red-600">Shelter Command Center</h1>
        <p className="mt-4 text-xl text-gray-600">Ready to manage applications and save lives?</p>
        <div className="mt-8 flex justify-center gap-4">
            <Link href="/admin" className="bg-red-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-red-600 transition">
            Go to Admin Panel
            </Link>
        </div>
      </section>
    );
  }

  // 2. LOGGED IN USER VIEW
  if (user) {
    return (
      <section className="text-center bg-brand-purple-light/40 rounded-3xl p-12">
        <h1 className="text-5xl font-extrabold text-brand-purple-dark">
            Welcome back, {user.user_metadata?.full_name || 'Friend'}!
        </h1>
        <p className="mt-4 text-xl text-gray-600">Your future best friend is waiting for you below.</p>
        <div className="mt-8">
            <Link href="/dashboard" className="bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-purple-dark transition">
            Check My Applications
            </Link>
        </div>
      </section>
    );
  }

  // 3. GUEST VIEW (Standard)
  return (
    // <section className="text-center py-12">
    //     <h1 className="text-5xl md:text-7xl font-extrabold text-brand-purple-dark tracking-tighter">
    //         Your Purrfect<br/>Companion Awaits.
    //     </h1>
        
    //     <p className="mt-4 max-w-lg mx-auto text-xl text-gray-600">
    //         Discover adorable, healthy, and playful cats ready to bring joy to your home.
    //     </p>
    //     <div className="mt-8 flex justify-center gap-4">
    //         <Link href="/signup" className="bg-brand-purple text-white font-bold px-8 py-3 rounded-xl hover:bg-brand-purple-dark transition shadow-lg">
    //             Join Us
    //         </Link>
    //         <Link href="#available-cats" className="bg-white text-brand-purple border-2 border-brand-purple font-bold px-8 py-3 rounded-xl hover:bg-brand-purple-light transition">
    //             Browse Cats
    //         </Link>
    //     </div>
    // </section>
          <section className="relative pt-20 pb-24 overflow-hidden">
            <div className="absolute inset-0 -z-10">
            <Image 
              src="/images/paws.png"  // <--- Make sure this matches your file name!
              alt="Background pattern"
              fill                       // This makes it stretch to cover the whole section
              className="object-cover opacity-60" // Low opacity makes it subtle so text is readable
              priority                   // Loads it immediately since it's at the top
            />
            {/* Optional: Add a gradient overlay so text pops even more */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80"></div>
          </div>


          <div className="relative container mx-auto grid md:grid-cols-2 items-center gap-8">
              <div className="text-center md:text-left animate-slide-in-up">
                  <h1 className="text-5xl md:text-7xl font-extrabold text-brand-purple-dark tracking-tighter">
                      Your Purrfect<br/>Companion Awaits.
                  </h1>
                  <p className="mt-4 max-w-lg mx-auto md:mx-0 text-xl text-gray-600">
                      Discover adorable, healthy, and playful cats ready to bring joy to your home. The journey to unconditional love starts with a single paw step.
                  </p>
                  <a href="#available-cats" className="mt-8 inline-block bg-brand-purple text-white font-bold px-10 py-4 rounded-xl text-lg transition-transform duration-300 hover:scale-105 shadow-lg mr-4 ml-4">
                      Meet Them Now
                  </a>
               <Link href="/signup" className="mt-8 inline-block bg-brand-purple text-white font-bold px-10 py-4 rounded-xl text-lg transition-transform duration-300 hover:scale-105 shadow-lg">
              Join US
             </Link>
                </div>
          </div>
      </section>
  );
}