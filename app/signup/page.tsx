'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // NEW: Role State
  const [isShelter, setIsShelter] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // NEW: Save the role!
            role: isShelter ? 'shelter' : 'adopter', 
          },
        },
      });

      if (error) throw error;
    toast.success('Account created! Redirecting...'); 
       setTimeout(() => {
          router.push('/login');
      }, 1500); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-purple-light/30">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <h1 className="text-3xl font-extrabold text-brand-purple text-center mb-6">Join Purrfect Paws</h1>

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Full Name (or Shelter Name)</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full p-3 border rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-xl" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-xl" required minLength={6} />
          </div>

          {/* NEW: Role Toggle */}
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 flex items-center gap-3">
            <input 
                type="checkbox" 
                id="shelterCheck" 
                checked={isShelter} 
                onChange={(e) => setIsShelter(e.target.checked)}
                className="w-5 h-5 text-brand-purple rounded focus:ring-brand-purple"
            />
            <label htmlFor="shelterCheck" className="text-gray-700 font-medium cursor-pointer select-none">
                I am a Shelter / I want to rehome a cat
            </label>
          </div>

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button disabled={loading} className="w-full bg-brand-purple text-white font-bold py-3.5 rounded-xl hover:bg-brand-purple-dark transition shadow-lg">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600">
          Already have an account? <Link href="/login" className="text-brand-purple font-bold">Log In</Link>
        </p>
      </div>
    </div>
  );
}
// 'use client';

// import { useState } from 'react';
// import { supabase } from '../../lib/supabase';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function SignupPage() {
//   const router = useRouter();
//   const [fullName, setFullName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false); // New state for success message

//   const handleSignup = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           data: {
//             full_name: fullName,
//           },
//           // CRITICAL: Tell Supabase where to send them after they click the link
//           emailRedirectTo: `${location.origin}/auth/callback`,
//         },
//       });

//       if (error) throw error;

//       // Show success message instead of redirecting
//       setIsSuccess(true);

//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // If successful, show the "Check Email" screen
//   if (isSuccess) {
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-brand-purple-light/30">
//             <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                     <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
//                 <p className="text-gray-600 mb-6">
//                     We've sent a confirmation link to <strong>{email}</strong>. 
//                     <br/>Please click the link to activate your account.
//                 </p>
//                 <Link href="/login" className="text-brand-purple font-bold hover:underline">
//                     Back to Login
//                 </Link>
//             </div>
//         </div>
//     );
//   }
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-brand-purple-light/30">
//       <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        
//         <div className="text-center mb-8">
//             <h1 className="text-3xl font-extrabold text-brand-purple">Join the Family</h1>
//             <p className="text-gray-500 mt-2">Create an account to start your adoption journey.</p>
//         </div>

//         <form onSubmit={handleSignup} className="space-y-5">
          
//           {/* Full Name Input */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
//             <input 
//                 type="text" 
//                 placeholder="e.g. Jane Doe" 
//                 value={fullName} 
//                 onChange={(e) => setFullName(e.target.value)} 
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all outline-none" 
//                 required 
//             />
//           </div>

//           {/* Email Input */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
//             <input 
//                 type="email" 
//                 placeholder="name@example.com" 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all outline-none" 
//                 required 
//             />
//           </div>

//           {/* Password Input */}
//           <div>
//             <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Password</label>
//             <input 
//                 type="password" 
//                 placeholder="••••••••" 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all outline-none" 
//                 required 
//                 minLength={6}
//             />
//           </div>

//           {error && (
//             <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center font-medium">
//                 {error}
//             </div>
//           )}

//           <button 
//             disabled={loading} 
//             className="w-full bg-brand-purple text-white font-bold py-3.5 rounded-xl hover:bg-brand-purple-dark transition-transform transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? 'Creating Account...' : 'Sign Up'}
//           </button>
//         </form>

//         <p className="mt-6 text-center text-gray-600">
//           Already have an account? <Link href="/login" className="text-brand-purple font-bold hover:underline">Log In</Link>
//         </p>
//       </div>
//     </div>
//   );
// }