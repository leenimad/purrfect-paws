'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 1. DEFINE ADMIN EMAIL
  const ADMIN_EMAIL = 'leeni.batta@gmail.com';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        router.refresh();
        router.push('/');
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // 2. CHECK IF ADMIN
  const isAdmin = user?.email === ADMIN_EMAIL;
  
  // 3. DEFINE DASHBOARD LINKS
  const dashboardLink = isAdmin ? '/admin' : '/dashboard';
  const dashboardLabel = isAdmin ? 'Admin Panel' : 'My Dashboard';

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <nav className="container mx-auto px-6 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-extrabold text-brand-purple-dark flex items-center gap-2 group">
          <span className="group-hover:rotate-12 transition-transform">🐾</span> 
          <span>Purrfect Paws</span>
        </Link>

        {/* MIDDLE NAVIGATION (DYNAMIC) */}
        <div className="hidden md:flex items-center space-x-8 font-medium">
            {isAdmin ? (
                // --- ADMIN LINKS ---
                <>
                    <Link href="/admin" className="text-gray-600 hover:text-red-600 transition">
                        Overview
                    </Link>
                    <Link href="/admin/add" className="text-gray-600 hover:text-red-600 transition">
                        + Add Cat
                    </Link>
                </>
            ) : (
                // --- USER / GUEST LINKS ---
                <>
                    <Link href="/#how-it-works" className="text-gray-600 hover:text-brand-purple transition">
                        Process
                    </Link>
                    <Link href="/#available-cats" className="text-gray-600 hover:text-brand-purple transition">
                        Cats
                    </Link>
                    <Link href="/contact" className="text-gray-600 hover:text-brand-purple transition">
                        Contact
                    </Link>
                </>
            )}
        </div>

        {/* AUTH BUTTONS */}
        <div className="flex items-center gap-4">
          {user ? (
            // LOGGED IN
            <div className="flex items-center gap-4">
              
              {/* Profile / Dashboard Link */}
              <Link href={dashboardLink} className="hidden sm:flex items-center gap-2 group cursor-pointer">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all
                    ${isAdmin ? 'bg-red-500 group-hover:bg-red-600' : 'bg-brand-purple group-hover:bg-brand-purple-dark'}`}>
                    
                    {/* 'A' for Admin, Initial for User */}
                    {isAdmin ? 'A' : (user.user_metadata?.full_name?.[0]?.toUpperCase() || 'U')}
                </div>
                
                <span className={`text-sm font-bold transition-colors ${isAdmin ? 'text-red-500' : 'text-gray-700'} group-hover:opacity-80`}>
                   {dashboardLabel}
                </span>
              </Link>

                     {/* --- NEW: SETTINGS LINK --- */}
              <Link href="/profile" className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-brand-purple transition-colors" title="Settings">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </Link>

              {/* Logout Button (Icon Version) */}
              <button 
                onClick={handleLogout}
                className="w-9 h-9 bg-white border border-gray-200 text-gray-500 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all shadow-sm"
                title="Log Out" // Shows text when you hover
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
              </button>
            </div>
          ) : (
            // LOGGED OUT
            <>
              <Link href="/login" className="hidden sm:block text-gray-600 hover:text-brand-purple font-bold">
                Log In
              </Link>
              <Link href="/signup" className="bg-brand-purple text-white font-bold px-5 py-2.5 rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg hover:bg-brand-purple-dark">
                Sign Up
              </Link>
            </>
          )}
        </div>

      </nav>
    </header>
  );
}
// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { supabase } from '../lib/supabase';
// import { useRouter } from 'next/navigation';

// export default function Header() {
//   const router = useRouter();
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [user, setUser] = useState<any>(null);

//   // DEFINING WHO THE ADMIN IS
//   const ADMIN_EMAIL = 'leeni.batta@gmail.com';

//   useEffect(() => {
//     // 1. Handle Scroll
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 10);
//     };
//     window.addEventListener('scroll', handleScroll);

//     // 2. Get User
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     getUser();

//     // 3. Listen for Auth Changes
//     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
//       setUser(session?.user ?? null);
//       if (event === 'SIGNED_OUT') {
//         router.refresh();
//         router.push('/');
//       }
//     });

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//       subscription.unsubscribe();
//     };
//   }, [router]);

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//   };

//   // --- LOGIC: DETERMINE DASHBOARD LINK ---
//   const isAdmin = user?.email === ADMIN_EMAIL;
//   const dashboardLink = isAdmin ? '/admin' : '/dashboard';
//   const dashboardLabel = isAdmin ? 'Admin Panel' : 'My Dashboard';

//   return (
//     <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
//       <nav className="container mx-auto px-6 flex justify-between items-center">
        
//         {/* Logo */}
//         <Link href="/" className="text-2xl font-extrabold text-brand-purple-dark flex items-center gap-2">
//           <span>🐾</span> Purrfect Paws
//         </Link>

//     {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-8 font-medium">
//           {/* CHANGED: Points to the new About page */}
//           <Link href="/about" className="text-gray-600 hover:text-brand-purple transition">
//             About Us
//           </Link>
          
//           {/* CHANGED: Added Contact link */}
//           <Link href="/contact" className="text-gray-600 hover:text-brand-purple transition">
//             Contact
//           </Link>
          
//           {/* Keep the Process link if you want, or remove it */}
//           <Link href="/#how-it-works" className="text-gray-600 hover:text-brand-purple transition">
//             How it Works
//           </Link>

//             <Link href="/#available-cats" className="text-gray-600 hover:text-brand-purple">Our Cats</Link>
//         </div>

//         {/* Auth Buttons */}
//         <div className="flex items-center gap-4">
//           {user ? (
//             // STATE: LOGGED IN
//             <div className="flex items-center gap-4">
              
//               {/* SMART DASHBOARD LINK */}
//               <Link href={dashboardLink} className="hidden sm:flex items-center gap-2 group cursor-pointer">
//                 <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all
//                     ${isAdmin ? 'bg-red-500 group-hover:bg-red-600' : 'bg-brand-purple group-hover:bg-brand-purple-dark'}`}>
                    
//                     {/* Show 'A' for Admin, or First Letter for User */}
//                     {isAdmin ? 'A' : (user.user_metadata?.full_name?.[0]?.toUpperCase() || 'U')}
//                 </div>
                
//                 <span className={`text-sm font-bold transition-colors ${isAdmin ? 'text-red-500' : 'text-gray-700'} group-hover:opacity-80`}>
//                    {dashboardLabel}
//                 </span>
//               </Link>

//               {/* Logout Button */}
//               <button 
//                 onClick={handleLogout}
//                 className="text-sm font-bold text-gray-500 hover:text-red-500 transition border border-gray-300 px-4 py-2 rounded-lg hover:border-red-300 bg-white"
//               >
//                 Log Out
//               </button>
//             </div>
//           ) : (
//             // STATE: LOGGED OUT
//             <>
//               <Link href="/login" className="hidden sm:block text-gray-600 hover:text-brand-purple font-bold">
//                 Log In
//               </Link>
//               <Link href="/signup" className="bg-brand-purple text-white font-bold px-5 py-2.5 rounded-xl transition-transform duration-300 hover:scale-105 shadow-lg hover:bg-brand-purple-dark">
//                 Sign Up
//               </Link>
//             </>
//           )}
//         </div>

//       </nav>
//     </header>
//   );
// }