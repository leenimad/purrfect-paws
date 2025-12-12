// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../../lib/supabase';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function UltimateDashboard() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [role, setRole] = useState('adopter');
  
//   // Data State
//   const [myApps, setMyApps] = useState<any[]>([]); // Apps I sent
//   const [incomingApps, setIncomingApps] = useState<any[]>([]); // Apps received for my cats
//   const [myCats, setMyCats] = useState<any[]>([]); // Cats I uploaded

//   useEffect(() => {
//     const init = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) return router.push('/login');
//       setUser(user);
//       setRole(user.user_metadata?.role || 'adopter');

//       // 1. Fetch Applications I SENT (For everyone)
//       const resApps = await fetch(`/api/applications/user?email=${user.email}`);
//       setMyApps(await resApps.json());

//       // 2. IF SHELTER: Fetch Cats & Incoming Apps
//       if (user.user_metadata?.role === 'shelter') {
//         // We need a new API route for this, or filter on client (client filter is easiest for now)
//         // Ideally: GET /api/shelter/dashboard?ownerId=...
//         // For simplicity, I will assume you build a route or logic to get this data.
//         // Let's create a specific route for this in Step 5.
//         const resShelter = await fetch(`/api/shelter/data?ownerId=${user.id}`);
//         const shelterData = await resShelter.json();
//         setMyCats(shelterData.cats);
//         setIncomingApps(shelterData.applications);
//       }
//     };
//     init();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-50 py-12">
//       <div className="container mx-auto px-4">
        
//         {/* Welcome Banner */}
//         <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 flex justify-between items-center">
//             <div>
//                 <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//                 <p className="text-gray-500">Logged in as: <strong className="text-brand-purple capitalize">{role}</strong></p>
//             </div>
//             {role === 'shelter' && (
//                 <Link href="/admin/add" className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-purple-dark shadow-lg">
//                     + Upload New Cat
//                 </Link>
//             )}
//         </div>

//         {/* SHELTER VIEW */}
//         {role === 'shelter' && (
//             <div className="space-y-12 mb-12">
                
//                 {/* Section 1: Incoming Applications */}
//                 <section>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">📢 Incoming Adoption Requests</h2>
//                     {incomingApps.length === 0 ? <p className="text-gray-500">No requests yet.</p> : (
//                         <div className="grid gap-4">
//                             {incomingApps.map(app => (
//                                 <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
//                                     <div>
//                                         <h3 className="font-bold text-lg">{app.applicantName}</h3>
//                                         <p className="text-sm text-gray-500">Wants to adopt: <strong className="text-brand-purple">{app.catName}</strong></p>
//                                     </div>
//                                     <Link href={`/admin/applications/${app._id}`} className="text-brand-purple font-bold border border-brand-purple px-4 py-2 rounded-lg hover:bg-brand-purple hover:text-white transition">
//                                         Review
//                                     </Link>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </section>

//                 {/* Section 2: My Cats */}
//                 <section>
//                     <h2 className="text-2xl font-bold text-gray-800 mb-4">🐱 My Listed Cats</h2>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//                         {myCats.map(cat => (
//                             <div key={cat._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
//                                 <img src={cat.imageUrls[0]} className="w-full h-32 object-cover rounded-lg mb-3" />
//                                 <h3 className="font-bold">{cat.name}</h3>
//                                 <p className={`text-sm font-bold ${cat.status === 'Available' ? 'text-green-500' : 'text-yellow-500'}`}>{cat.status}</p>
//                             </div>
//                         ))}
//                     </div>
//                 </section>
//             </div>
//         )}

//         {/* ADOPTER VIEW (Everyone sees this) */}
//         <section>
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">📤 My Adoption Applications</h2>
//             {/* ... (Use the same list code from previous User Dashboard) ... */}
//             {myApps.length === 0 ? <p className="text-gray-500">You haven't applied for any cats.</p> : (
//                  <div className="grid gap-4">
//                     {myApps.map(app => (
//                         <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
//                             <h3 className="font-bold">{app.catName}</h3>
//                             <p className="text-sm text-gray-500">Status: {app.status || 'Pending'}</p>
//                         </div>
//                     ))}
//                  </div>
//             )}
//         </section>

//       </div>
//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Application, Cat } from '../../types'; // Import types
import CatCard from '@/components/CatCard'; // Import the Card for Favorites
import { jsPDF } from 'jspdf';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Data State
  const [myApps, setMyApps] = useState<Application[]>([]); 
  const [favorites, setFavorites] = useState<Cat[]>([]); // NEW: Favorites State
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      // 1. Check Login
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      setUser(user);

      try {
        // 2. Fetch Applications I SENT
        const resApps = await fetch(`/api/applications/user?email=${user.email}`);
        if (resApps.ok) setMyApps(await resApps.json());

        // 3. Fetch My FAVORITES (The New Feature)
        const resFavs = await fetch(`/api/favorites/user?userId=${user.id}`);
        if (resFavs.ok) setFavorites(await resFavs.json());
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (loading) return <div className="p-10 text-center text-brand-purple font-bold">Loading Dashboard...</div>;

  // ... inside UserDashboard component ...

const generateCertificate = (app: any) => {
    const doc = new jsPDF({ orientation: 'landscape' });
    // Border
    doc.setLineWidth(3);
    doc.setDrawColor(139, 92, 246);
    doc.rect(10, 10, 277, 190);
    // Text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(139, 92, 246);
    doc.text("Certificate of Adoption", 148.5, 50, { align: "center" });
    
    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.text("This certifies that", 148.5, 90, { align: "center" });
    doc.setFontSize(30);
    doc.text(user?.user_metadata?.full_name || "Adopter", 148.5, 105, { align: "center" }); // Use User's Name
    
    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("Has officially provided a loving forever home for", 148.5, 120, { align: "center" });
    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(app.catName, 148.5, 135, { align: "center" });
    
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 180);
    
    doc.save(`${app.catName}_Adoption_Certificate.pdf`);
};

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        
        {/* Welcome Banner */}
        <div className="bg-white rounded-3xl p-8 mb-10 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
                <p className="text-gray-500 mt-1">
                    Welcome back, <span className="text-brand-purple font-bold">{user?.user_metadata?.full_name || user?.email}</span>!
                </p>
            </div>
            <Link href="/" className="bg-brand-purple text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-purple-dark shadow-lg transition-transform hover:scale-105">
                Browse More Cats
            </Link>
        </div>

                    {/* SECTION 2: My Favorites (New Feature) */}
        <section className='mb-12'>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>❤️</span> My Saved Cats
            </h2>

            {favorites.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">You haven't added any cats to your favorites yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {favorites.map(cat => (
                        <CatCard key={cat._id?.toString()} cat={cat} />
                    ))}
                </div>
            )}
        </section>

        
        {/* SECTION 1: My Adoption Applications */}
        <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📤</span> My Adoption Applications
            </h2>
            
            {myApps.length === 0 ? (
                 <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-gray-500">You haven't applied for any cats yet.</p>
                 </div>
            ) : (
                 <div className="grid gap-4">
                    {myApps.map(app => (
                        <div key={app._id?.toString()} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center transition-shadow hover:shadow-md">
                            <div>
                                <h3 className="font-bold text-xl text-gray-800">{app.catName}</h3>
                                <p className="text-sm text-gray-500">Submitted: {new Date(app.submissionDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                                    app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {app.status || 'Pending'}
                                </span>
                                <br />
                                <Link href={`/cats/${app.catId}`} className="text-brand-purple text-sm font-bold hover:underline mt-1 inline-block">
                                    View Cat
                                </Link>
                                
    {/* NEW: SHOW CERTIFICATE IF APPROVED */}
    {app.status === 'Approved' && (
        <button 
            onClick={() => generateCertificate(app)}
            className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-100 font-bold flex items-center gap-1"
        >
            <span>📄</span> Download Certificate
        </button>
    )}

                            </div>
                        </div>
                    ))}
                 </div>
            )}
        </section>



      </div>
    </div>
  );
}