// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '../lib/supabase';
// import { useRouter } from 'next/navigation';

// export default function AdoptButton({ catId }: { catId: string }) {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     // Check if user is logged in when component loads
//     const checkUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       setUser(user);
//     };
//     checkUser();
//   }, []);

//   const handleClick = () => {
//     if (user) {
//       // User is logged in, go to adoption form
//       router.push(`/adopt/${catId}`);
//     } else {
//       // User is NOT logged in, send to login
//       alert("Please log in to adopt this cutie!");
//       router.push('/login');
//     }
//   };

//   return (
//     <button 
//       onClick={handleClick}
//       className="w-full bg-brand-purple-dark text-white text-lg font-bold py-3 px-6 rounded-xl hover:bg-brand-purple transition-transform transform hover:scale-105 shadow-lg"
//     >
//       Adopt Me!
//     </button>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdoptButton({ catId }: { catId: string }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  const handleClick = () => {
    if (user) {
      router.push(`/adopt/${catId}`);
    } else {
      setShowModal(true); // Show the cute modal instead of ugly alert
    }
  };

  return (
    <>
      <button 
        onClick={handleClick}
        className="w-full bg-brand-purple-dark text-white text-lg font-bold py-3 px-6 rounded-xl hover:bg-brand-purple transition-transform transform hover:scale-105 shadow-lg"
      >
        Adopt Me!
      </button>

      {/* THE CUTE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity">
          {/* Modal Content */}
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 border-4 border-brand-purple-light animate-fade-in relative">
            
            {/* Close 'X' Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl"
            >
              &times;
            </button>

            {/* Cute Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-brand-purple-light p-4 rounded-full">
                <svg className="w-10 h-10 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
            </div>

            {/* Text */}
            <h3 className="text-xl font-bold text-center text-gray-800 mb-2">Login Required</h3>
            <p className="text-center text-gray-600 mb-6">
              To adopt this cutie, we need to know who you are! Please log in to start the application.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              <Link 
                href="/login"
                className="block w-full text-center bg-brand-purple text-white font-bold py-3 rounded-xl hover:bg-brand-purple-dark transition"
              >
                Go to Login
              </Link>
              <button 
                onClick={() => setShowModal(false)}
                className="block w-full text-center bg-gray-100 text-gray-500 font-bold py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Maybe Later
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}