// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../../lib/supabase';
// import { useRouter } from 'next/navigation';
// import { Application } from '../../types';
// import Link from 'next/link';

// export default function UserDashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       // 1. Get Logged In User
//       const { data: { user } } = await supabase.auth.getUser();
      
//       if (!user) {
//         router.push('/login'); // Kick them out if not logged in
//         return;
//       }
      
//       setUser(user);

//       // 2. Fetch their applications using their email
//       try {
//         const res = await fetch(`/api/applications/user?email=${user.email}`);
//         if (res.ok) {
//           const data = await res.json();
//           setApplications(data);
//         }
//       } catch (error) {
//         console.error("Error fetching applications", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router]);

//   if (loading) {
//     return <div className="min-h-screen flex justify-center items-center text-brand-purple font-bold">Loading Dashboard...</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
        
//         {/* Header Section */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row justify-between items-center">
//             <div>
//                 <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
//                 <p className="text-gray-500 mt-2">
//                     Welcome back, <span className="text-brand-purple font-bold">{user?.user_metadata?.full_name || user?.email}</span>!
//                 </p>
//             </div>
//             <div className="mt-4 md:mt-0">
//                 <Link href="/" className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-purple-dark transition shadow-lg">
//                     Browse More Cats
//                 </Link>
//             </div>
//         </div>

//         {/* Applications List */}
//         <h2 className="text-2xl font-bold text-gray-800 mb-6 ml-2">My Adoption Applications</h2>

//         {applications.length === 0 ? (
//             <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
//                 <div className="text-6xl mb-4">😿</div>
//                 <h3 className="text-xl font-bold text-gray-800">No applications yet</h3>
//                 <p className="text-gray-500 mt-2 mb-6">You haven't applied for any furry friends yet.</p>
//                 <Link href="/" className="text-brand-purple font-bold hover:underline">Find a cat to adopt</Link>
//             </div>
//         ) : (
//             <div className="grid gap-6">
//                 {applications.map((app) => (
//                     <div key={app._id?.toString()} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-center gap-6">
                        
//                         {/* Left: Cat Info */}
//                         <div className="flex items-center gap-4 w-full md:w-auto">
//                             <div className="h-16 w-16 bg-brand-purple-light rounded-2xl flex items-center justify-center text-2xl">
//                                 🐾
//                             </div>
//                             <div>
//                                 <h3 className="text-xl font-bold text-gray-900">{app.catName}</h3>
//                                 <p className="text-sm text-gray-500">
//                                     Submitted on {new Date(app.submissionDate).toLocaleDateString()}
//                                 </p>
//                             </div>
//                         </div>

//              {/* Middle: Status Badge */}
//                         <div className="w-full md:w-auto text-center">
//                             <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold 
//                                 ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
//                                   app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
//                                   'bg-yellow-100 text-yellow-700'}`}>
                                
//                                 {app.status === 'Pending' || !app.status ? (
//                                     <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
//                                 ) : null}
                                
//                                 {app.status || 'Pending'}
//                             </span>
//                         </div>

//                         {/* Right: Action */}
//                         <div className="w-full md:w-auto text-center md:text-right">
//                              <Link href={`/cats/${app.catId}`} className="text-sm font-bold text-brand-purple hover:underline">
//                                 View Cat Profile
//                              </Link>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         )}
//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UltimateDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState('adopter');
  
  // Data State
  const [myApps, setMyApps] = useState<any[]>([]); // Apps I sent
  const [incomingApps, setIncomingApps] = useState<any[]>([]); // Apps received for my cats
  const [myCats, setMyCats] = useState<any[]>([]); // Cats I uploaded

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      setUser(user);
      setRole(user.user_metadata?.role || 'adopter');

      // 1. Fetch Applications I SENT (For everyone)
      const resApps = await fetch(`/api/applications/user?email=${user.email}`);
      setMyApps(await resApps.json());

      // 2. IF SHELTER: Fetch Cats & Incoming Apps
      if (user.user_metadata?.role === 'shelter') {
        // We need a new API route for this, or filter on client (client filter is easiest for now)
        // Ideally: GET /api/shelter/dashboard?ownerId=...
        // For simplicity, I will assume you build a route or logic to get this data.
        // Let's create a specific route for this in Step 5.
        const resShelter = await fetch(`/api/shelter/data?ownerId=${user.id}`);
        const shelterData = await resShelter.json();
        setMyCats(shelterData.cats);
        setIncomingApps(shelterData.applications);
      }
    };
    init();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500">Logged in as: <strong className="text-brand-purple capitalize">{role}</strong></p>
            </div>
            {role === 'shelter' && (
                <Link href="/admin/add" className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-purple-dark shadow-lg">
                    + Upload New Cat
                </Link>
            )}
        </div>

        {/* SHELTER VIEW */}
        {role === 'shelter' && (
            <div className="space-y-12 mb-12">
                
                {/* Section 1: Incoming Applications */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">📢 Incoming Adoption Requests</h2>
                    {incomingApps.length === 0 ? <p className="text-gray-500">No requests yet.</p> : (
                        <div className="grid gap-4">
                            {incomingApps.map(app => (
                                <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{app.applicantName}</h3>
                                        <p className="text-sm text-gray-500">Wants to adopt: <strong className="text-brand-purple">{app.catName}</strong></p>
                                    </div>
                                    <Link href={`/admin/applications/${app._id}`} className="text-brand-purple font-bold border border-brand-purple px-4 py-2 rounded-lg hover:bg-brand-purple hover:text-white transition">
                                        Review
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Section 2: My Cats */}
                <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">🐱 My Listed Cats</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {myCats.map(cat => (
                            <div key={cat._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <img src={cat.imageUrls[0]} className="w-full h-32 object-cover rounded-lg mb-3" />
                                <h3 className="font-bold">{cat.name}</h3>
                                <p className={`text-sm font-bold ${cat.status === 'Available' ? 'text-green-500' : 'text-yellow-500'}`}>{cat.status}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        )}

        {/* ADOPTER VIEW (Everyone sees this) */}
        <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">📤 My Adoption Applications</h2>
            {/* ... (Use the same list code from previous User Dashboard) ... */}
            {myApps.length === 0 ? <p className="text-gray-500">You haven't applied for any cats.</p> : (
                 <div className="grid gap-4">
                    {myApps.map(app => (
                        <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h3 className="font-bold">{app.catName}</h3>
                            <p className="text-sm text-gray-500">Status: {app.status || 'Pending'}</p>
                        </div>
                    ))}
                 </div>
            )}
        </section>

      </div>
    </div>
  );
}