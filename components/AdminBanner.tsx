'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function AdminBanner() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'admin@purrfectpaws.com') {
        setIsAdmin(true);
      }
    };
    checkUser();
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="bg-brand-purple-dark text-white p-4 text-center">
      <p className="font-bold inline-block mr-4">👋 Welcome back, Admin!</p>
      <Link href="/admin" className="underline text-sm hover:text-gray-200">
        Go to Dashboard to manage {'>'}
      </Link>
    </div>
  );
}