'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import AdoptButton from './AdoptButton';

interface CatProfileActionsProps {
  catId: string;
  catStatus: string;
}

export default function CatProfileActions({ catId, catStatus }: CatProfileActionsProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // YOUR ADMIN EMAIL
  const ADMIN_EMAIL = 'leeni.batta@gmail.com';

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Check if logged in AND matches admin email
      if (user && user.email === ADMIN_EMAIL) {
        setIsAdmin(true);
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) return <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse"></div>;

  // --- VIEW 1: ADMIN VIEW ---
  if (isAdmin) {
    return (
      <div className="flex flex-col gap-3">
        <Link 
          href={`/admin/edit/${catId}`} // We will build this page later if you want!
          className="w-full bg-blue-600 text-white text-lg font-bold py-3 px-6 rounded-xl hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-lg text-center flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          Edit Cat Details
        </Link>
        <p className="text-center text-xs text-gray-400">
            You are viewing this as an Admin.
        </p>
      </div>
    );
  }

  // --- VIEW 2: USER VIEW ---
  
  // Case 1: Available -> Show Adopt Button
  if (catStatus === 'Available') {
    return <AdoptButton catId={catId} />;
  } 
  
  // Case 2: Adopted -> Show Happy Message
  else if (catStatus === 'Adopted') {
    return (
        <button disabled className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl cursor-default text-lg shadow-inner opacity-90">
            🏠 Officially Adopted!
        </button>
    );
  }
  
  // Case 3: Pending -> Show Pending Message
  else {
    return (
        <button disabled className="w-full bg-yellow-100 text-yellow-700 font-bold py-4 rounded-xl cursor-not-allowed text-lg border border-yellow-200">
            ⏳ Application Pending
        </button>
    );
  }
}