// 'use client';

// import { useEffect, useState } from 'react';
// import { supabase } from '../../lib/supabase';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import ConfirmModal from '@/components/ConfirmModal';
// import { toast } from 'react-hot-toast';

// export default function AdminDashboard() {
//   const router = useRouter();
//   const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'cats'
//   const [applications, setApplications] = useState<any[]>([]);
//   const [cats, setCats] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [catToDelete, setCatToDelete] = useState<string | null>(null);

//   const [isAppModalOpen, setIsAppModalOpen] = useState(false);
//   const [pendingAppAction, setPendingAppAction] = useState<{appId: string, status: string, catId: string} | null>(null);

//   // 1. Fetch Data
//   const fetchData = async () => {
//     setLoading(true);
//     // Fetch Apps
//     const appRes = await fetch('/api/admin/applications');
//     const appData = await appRes.json();
//     setApplications(appData);

//     // Fetch Cats (Reusing our public API)
//     const catRes = await fetch('/api/cats');
//     const catData = await catRes.json();
//     setCats(catData);
    
//     setLoading(false);
//   };
// //

// //
//   useEffect(() => {
//     // 2. Admin Check
//     const checkAdmin = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       // REPLACE THIS WITH YOUR ACTUAL ADMIN EMAIL
//       if (!user || user.email !== 'leeni.batta@gmail.com') {
//         router.push('/'); // Kick out non-admins
//       } else {
//         fetchData();
//       }
//     };
//     checkAdmin();
//   }, [router]);

//   // 3. Handle Status Update
// // 1. User clicks "Approve" or "Reject" -> OPEN MODAL
//   const confirmStatusUpdate = (appId: string, status: string, catId: string) => {
//     setPendingAppAction({ appId, status, catId });
//     setIsAppModalOpen(true);
//   };

//   // 2. User clicks "Yes" in Modal -> UPDATE SERVER
//   const executeStatusUpdate = async () => {
//     if (!pendingAppAction) return;

//     // Close modal
//     setIsAppModalOpen(false);
//     const toastId = toast.loading(`Marking as ${pendingAppAction.status}...`);

//     try {
//         await fetch('/api/admin/applications/update', {
//             method: 'PATCH',
//             body: JSON.stringify({ 
//                 appId: pendingAppAction.appId, 
//                 status: pendingAppAction.status, 
//                 catId: pendingAppAction.catId 
//             })
//         });
        
//         toast.success(`Application ${pendingAppAction.status}`, { id: toastId });
//         fetchData(); // Refresh the list
//     } catch (error) {
//         toast.error("Failed to update status", { id: toastId });
//     }
//   };

//   if (loading) return <div className="p-10 text-center text-brand-purple font-bold">Loading Admin Panel...</div>;

//   // Open the modal
//   const handleDeleteClick = (catId: string) => {
//     setCatToDelete(catId);
//     setIsDeleteModalOpen(true);

//   };

//   // Actually delete the cat (Called when user clicks "Yes")
//   const executeDelete = async () => {
//     if (!catToDelete) return;

//     // Close modal immediately to feel responsive
//     setIsDeleteModalOpen(false); 
    
//     // Show loading toast
//     const toastId = toast.loading('Deleting cat...');

//     try {
//       const res = await fetch(`/api/cats?id=${catToDelete}`, {
//         method: 'DELETE',
//       });

//       if (!res.ok) throw new Error('Failed to delete');

//       toast.success('Cat removed successfully', { id: toastId });
      
//       // Refresh the list automatically
//       fetchData(); 

//     } catch (error) {
//       toast.error('Error deleting cat', { id: toastId });
//     }
//   };
// return (
//     <div className="min-h-screen bg-gray-50 p-8">
//       <div className="container mx-auto">
        
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//             <h1 className="text-3xl font-extrabold text-gray-800">Shelter Admin</h1>
//             <Link href="/admin/add" className="bg-brand-purple text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-purple-dark shadow-lg">
//                 + Add New Cat
//             </Link>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-6 border-b border-gray-200">
//             <button 
//                 onClick={() => setActiveTab('applications')}
//                 className={`pb-2 px-4 font-bold ${activeTab === 'applications' ? 'text-brand-purple border-b-4 border-brand-purple' : 'text-gray-500'}`}
//             >
//                 Applications ({applications.length})
//             </button>
//             <button 
//                 onClick={() => setActiveTab('cats')}
//                 className={`pb-2 px-4 font-bold ${activeTab === 'cats' ? 'text-brand-purple border-b-4 border-brand-purple' : 'text-gray-500'}`}
//             >
//                 Manage Cats ({cats.length})
//             </button>
//         </div>
// {/* CONTENT: APPLICATIONS */}
//         {activeTab === 'applications' && (
//             <div className="space-y-4">
                
//                 {/* --- MOBILE VIEW (CARDS) --- */}
//                 {/* Visible on small screens, hidden on md (desktop) and up */}
//                 <div className="md:hidden grid gap-4">
//                     {applications.map((app) => (
//                         <div 
//                             key={app._id} 
//                             onClick={() => router.push(`/admin/applications/${app._id}`)}
//                             className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
//                         >
//                             <div className="flex justify-between items-start mb-3">
//                                 <div>
//                                     <h3 className="font-bold text-gray-900">{app.applicantName}</h3>
//                                     <p className="text-xs text-gray-500">{app.applicantEmail}</p>
//                                 </div>
//                                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                                     app.status === 'Approved' ? 'bg-green-100 text-green-700' :
//                                     app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
//                                     'bg-yellow-100 text-yellow-700'
//                                 }`}>
//                                     {app.status || 'Pending'}
//                                 </span>
//                             </div>
                            
//                             <div className="text-sm text-gray-600 mb-4">
//                                 Wants to adopt: <strong className="text-brand-purple">{app.catName}</strong>
//                                 <br />
//                                 <span className="text-xs text-gray-400">
//                                     {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : 'Date Unknown'}
//                                 </span>
//                             </div>

//                             {/* Mobile Action Buttons (Full Width) */}
//                             {(!app.status || app.status === 'Pending') && (
//                                 <div className="grid grid-cols-2 gap-3 mt-4">
//                                     <button 
//                                         onClick={(e) => {
//                                             e.stopPropagation(); // Stop click from opening the row
//                                             confirmStatusUpdate(app._id, 'Approved', app.catId);
//                                         }}
//                                         className="bg-green-500 text-white py-2 rounded-lg font-bold text-sm"
//                                     >
//                                         Approve
//                                     </button>
//                                     <button 
//                                         onClick={(e) => {
//                                             e.stopPropagation();
//                                             confirmStatusUpdate(app._id, 'Rejected', app.catId);
//                                         }}
//                                         className="bg-red-500 text-white py-2 rounded-lg font-bold text-sm"
//                                     >
//                                         Reject
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* --- DESKTOP VIEW (TABLE) --- */}
//                 {/* Hidden on small screens, Visible on md and up */}
//                 <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
//                     <table className="w-full text-left">
//                         <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
//                             <tr>
//                                 <th className="p-4">Applicant</th>
//                                 <th className="p-4">Cat</th>
//                                 <th className="p-4">Date</th>
//                                 <th className="p-4">Status</th>
//                                 <th className="p-4">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-100">
//                             {applications.map((app) => (
//                                 <tr 
//                                     key={app._id} 
//                                     onClick={() => router.push(`/admin/applications/${app._id}`)}
//                                     className="hover:bg-purple-50 transition-colors cursor-pointer group"
//                                 >
//                                     <td className="p-4">
//                                         <div className="font-bold text-gray-900 group-hover:text-brand-purple transition-colors">
//                                             {app.applicantName}
//                                         </div>
//                                         <div className="text-xs text-gray-500">{app.applicantEmail}</div>
//                                     </td>
//                                     <td className="p-4 font-medium text-gray-700">{app.catName}</td>
//                                     <td className="p-4 text-sm text-gray-500">
//                                         {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : 'Unknown'}
//                                     </td>
//                                     <td className="p-4">
//                                         <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                                             app.status === 'Approved' ? 'bg-green-100 text-green-700' :
//                                             app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
//                                             'bg-yellow-100 text-yellow-700'
//                                         }`}>
//                                             {app.status || 'Pending'}
//                                         </span>
//                                     </td>
//                                     <td className="p-4">
//                                         {(!app.status || app.status === 'Pending') && (
//                                             <div className="flex gap-2">
//                                                 <button 
//                                                     onClick={(e) => {
//                                                         e.stopPropagation(); // Prevents row click
//                                                         confirmStatusUpdate(app._id, 'Approved', app.catId);
//                                                     }}
//                                                     className="text-xs bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 font-bold shadow-sm hover:shadow-md transition-all"
//                                                 >
//                                                     Approve
//                                                 </button>
//                                                 <button 
//                                                     onClick={(e) => {
//                                                         e.stopPropagation(); // Prevents row click
//                                                         confirmStatusUpdate(app._id, 'Rejected', app.catId);
//                                                     }}
//                                                     className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 font-bold shadow-sm hover:shadow-md transition-all"
//                                                 >
//                                                     Reject
//                                                 </button>
//                                             </div>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         )}
// {/* CONTENT: CATS */}
//         {activeTab === 'cats' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {cats.map((cat) => (
//                     <div key={cat._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex justify-between items-center group hover:shadow-md transition-shadow">
                        
//                         {/* --- NEW: WRAP THIS PART IN A LINK --- */}
//                         <Link href={`/cats/${cat._id}`} className="flex gap-4 items-center flex-grow cursor-pointer">
//                             <div className="h-14 w-14 relative rounded-lg overflow-hidden flex-shrink-0 group-hover:opacity-90 transition-opacity">
//                                 <Image src={cat.imageUrls[0]} alt={cat.name} fill className="object-cover" />
//                             </div>
//                             <div>
//                                 <div className="font-bold text-gray-800 group-hover:text-brand-purple transition-colors">{cat.name}</div>
//                                 <div className={`text-xs font-bold ${cat.status === 'Available' ? 'text-green-500' : 'text-yellow-500'}`}>
//                                     {cat.status}
//                                 </div>
//                             </div>
//                         </Link>
//                         {/* ------------------------------------- */}

//                         {/* Delete Button (Keep this separate so clicking it doesn't open the profile) */}
//                         <button 
//                             onClick={(e) => {
//                                 e.preventDefault(); // Stop the link from clicking
//                                 e.stopPropagation();
//                                 handleDeleteClick(cat._id);
//                             }}
//                             className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
//                             title="Delete Cat"
//                         >
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         )}
//       </div>

//       {/* --- THE MODAL IS HERE --- */}
// <ConfirmModal 
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={executeDelete}
//         title="Remove Cat?"
//         message="Are you sure? This will remove the cat from the website permanently."
//         type="reject"
//       />

// <ConfirmModal 
//         isOpen={isAppModalOpen}
//         onClose={() => setIsAppModalOpen(false)}
//         onConfirm={executeStatusUpdate}
//         title={pendingAppAction?.status === 'Approved' ? 'Approve Application?' : 'Reject Application?'}
//         message={`Are you sure you want to mark this application as ${pendingAppAction?.status}?`}
//         // If status is 'Rejected', make button Red. If 'Approved', make it Green/Blue (default)
//         type={pendingAppAction?.status === 'Rejected' ? 'reject' : 'approve'} 
//       />

//     </div>
//   );
// }
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from 'react-hot-toast';
// NEW IMPORTS
import { jsPDF } from 'jspdf';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<string | null>(null);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [pendingAppAction, setPendingAppAction] = useState<{appId: string, status: string, catId: string} | null>(null);

  // NEW: Search State
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);
    const appRes = await fetch('/api/admin/applications');
    const appData = await appRes.json();
    setApplications(appData);

    const catRes = await fetch('/api/cats');
    const catData = await catRes.json();
    setCats(catData);
    setLoading(false);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // REPLACE WITH YOUR EMAIL
      if (!user || user.email !== 'leeni.batta@gmail.com') {
        router.push('/');
      } else {
        fetchData();
      }
    };
    checkAdmin();
  }, [router]);

  // --- FEATURE 2: SEARCH FILTER LOGIC ---
  const filteredApplications = applications.filter(app => 
    app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.catName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.applicantEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FEATURE 1: ANALYTICS DATA PREP ---
  const catStats = [
    { name: 'Available', value: cats.filter(c => c.status === 'Available').length, color: '#22c55e' }, // Green
    { name: 'Pending', value: cats.filter(c => c.status === 'Pending').length, color: '#eab308' },   // Yellow
    { name: 'Adopted', value: cats.filter(c => c.status === 'Adopted').length, color: '#8b5cf6' },   // Purple
  ];

  // --- FEATURE 3: PDF CERTIFICATE GENERATOR ---
  const generateCertificate = (app: any) => {
    const doc = new jsPDF({ orientation: 'landscape' });

    // Decorative Border
    doc.setLineWidth(3);
    doc.setDrawColor(139, 92, 246); // Brand Purple
    doc.rect(10, 10, 277, 190);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(139, 92, 246);
    doc.text("Certificate of Adoption", 148.5, 50, { align: "center" });

    // Subtitle
    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text("Purrfect Paws Official Document", 148.5, 65, { align: "center" });

    // Content
    doc.setFontSize(20);
    doc.setTextColor(0);
    doc.text("This certifies that", 148.5, 90, { align: "center" });

    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(app.applicantName, 148.5, 105, { align: "center" });

    doc.setFontSize(20);
    doc.setFont("helvetica", "normal");
    doc.text("Has officially provided a loving forever home for", 148.5, 120, { align: "center" });

    doc.setFontSize(30);
    doc.setFont("helvetica", "bold");
    doc.text(app.catName, 148.5, 135, { align: "center" });

    // Footer
    doc.setFontSize(14);
    doc.setFont("helvetica", "italic");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 180);
    doc.text("Signed: ____________________", 200, 180);

    // Save
    doc.save(`${app.applicantName}_Adoption_Certificate.pdf`);
  };

  // --- EXISTING HANDLERS ---
  const confirmStatusUpdate = (appId: string, status: string, catId: string) => {
    setPendingAppAction({ appId, status, catId });
    setIsAppModalOpen(true);
  };

  const executeStatusUpdate = async () => {
    if (!pendingAppAction) return;
    setIsAppModalOpen(false);
    const toastId = toast.loading(`Marking as ${pendingAppAction.status}...`);
    try {
        await fetch('/api/admin/applications/update', {
            method: 'PATCH',
            body: JSON.stringify(pendingAppAction)
        });
        toast.success(`Application ${pendingAppAction.status}`, { id: toastId });
        fetchData();
    } catch (error) {
        toast.error("Failed to update status", { id: toastId });
    }
  };

  const handleDeleteClick = (catId: string) => {
    setCatToDelete(catId);
    setIsDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!catToDelete) return;
    setIsDeleteModalOpen(false); 
    const toastId = toast.loading('Deleting cat...');
    try {
      const res = await fetch(`/api/cats?id=${catToDelete}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Cat removed successfully', { id: toastId });
      fetchData(); 
    } catch (error) {
      toast.error('Error deleting cat', { id: toastId });
    }
  };

  if (loading) return <div className="p-20 text-center text-brand-purple font-bold text-2xl">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="container mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h1 className="text-3xl font-extrabold text-gray-800">Shelter Admin</h1>
            <Link href="/admin/add" className="bg-brand-purple text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-purple-dark shadow-lg transition-transform hover:scale-105">
                + Add New Cat
            </Link>
        </div>

        {/* --- FEATURE 1: ANALYTICS CHART --- */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center justify-around">
            <div className="text-center mb-6 md:mb-0">
                <h3 className="text-lg font-bold text-gray-700 mb-2">Shelter Overview</h3>
                <p className="text-4xl font-extrabold text-brand-purple">{cats.length} <span className="text-sm font-normal text-gray-500">Total Cats</span></p>
                <p className="text-4xl font-extrabold text-blue-500 mt-2">{applications.length} <span className="text-sm font-normal text-gray-500">Applications</span></p>
            </div>
            <div className="h-64 w-full md:w-1/2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={catStats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                            {catStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('applications')}
                className={`pb-2 px-4 font-bold ${activeTab === 'applications' ? 'text-brand-purple border-b-4 border-brand-purple' : 'text-gray-500'}`}
            >
                Applications
            </button>
            <button 
                onClick={() => setActiveTab('cats')}
                className={`pb-2 px-4 font-bold ${activeTab === 'cats' ? 'text-brand-purple border-b-4 border-brand-purple' : 'text-gray-500'}`}
            >
                Manage Cats
            </button>
        </div>

        {/* CONTENT: APPLICATIONS */}
        {activeTab === 'applications' && (
            <div className="space-y-4">
                
                {/* --- FEATURE 2: SEARCH BAR --- */}
                <div className="relative mb-4">
                    <input 
                        type="text"
                        placeholder="Search by Applicant, Cat, or Email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple focus:outline-none"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>

                {/* --- MOBILE VIEW (CARDS) --- */}
                <div className="md:hidden grid gap-4">
                    {filteredApplications.map((app) => (
                        <div 
                            key={app._id} 
                            onClick={() => router.push(`/admin/applications/${app._id}`)}
                            className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-gray-900">{app.applicantName}</h3>
                                    <p className="text-xs text-gray-500">{app.applicantEmail}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                    app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {app.status || 'Pending'}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-4">
                                Wants to adopt: <strong className="text-brand-purple">{app.catName}</strong>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                                {(!app.status || app.status === 'Pending') && (
                                    <>
                                        <button onClick={() => confirmStatusUpdate(app._id, 'Approved', app.catId)} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold text-sm">Approve</button>
                                        <button onClick={() => confirmStatusUpdate(app._id, 'Rejected', app.catId)} className="flex-1 bg-red-500 text-white py-2 rounded-lg font-bold text-sm">Reject</button>
                                    </>
                                )}
                                {/* FEATURE 3: CERTIFICATE BUTTON (Mobile) */}
                                {app.status === 'Approved' && (
                                    <button onClick={() => generateCertificate(app)} className="w-full bg-blue-500 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                                        <span>📄</span> Certificate
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- DESKTOP VIEW (TABLE) --- */}
                <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Applicant</th>
                                <th className="p-4">Cat</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredApplications.map((app) => (
                                <tr 
                                    key={app._id} 
                                    onClick={() => router.push(`/admin/applications/${app._id}`)}
                                    className="hover:bg-purple-50 transition-colors cursor-pointer group"
                                >
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{app.applicantName}</div>
                                        <div className="text-xs text-gray-500">{app.applicantEmail}</div>
                                    </td>
                                    <td className="p-4 font-medium text-gray-700">{app.catName}</td>
                                    <td className="p-4 text-sm text-gray-500">{new Date(app.submissionDate).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                            app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                            app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {app.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                        {(!app.status || app.status === 'Pending') && (
                                            <div className="flex gap-2">
                                                <button onClick={() => confirmStatusUpdate(app._id, 'Approved', app.catId)} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 font-bold">Approve</button>
                                                <button onClick={() => confirmStatusUpdate(app._id, 'Rejected', app.catId)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 font-bold">Reject</button>
                                            </div>
                                        )}
                                        {/* FEATURE 3: CERTIFICATE BUTTON (Desktop) */}
                                        {app.status === 'Approved' && (
                                            <button 
                                                onClick={() => generateCertificate(app)}
                                                className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded hover:bg-blue-100 font-bold flex items-center gap-1"
                                            >
                                                <span>📄</span> Certificate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* CONTENT: CATS (Same as before) */}
        {activeTab === 'cats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cats.map((cat) => (
                    <div key={cat._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex justify-between items-center group hover:shadow-md transition-shadow">
                        <Link href={`/cats/${cat._id}`} className="flex gap-4 items-center flex-grow cursor-pointer">
                            <div className="h-14 w-14 relative rounded-lg overflow-hidden flex-shrink-0 group-hover:opacity-90 transition-opacity">
                                <Image src={cat.imageUrls[0]} alt={cat.name} fill className="object-cover" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-800 group-hover:text-brand-purple transition-colors">{cat.name}</div>
                                <div className={`text-xs font-bold ${cat.status === 'Available' ? 'text-green-500' : 'text-yellow-500'}`}>{cat.status}</div>
                            </div>
                        </Link>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteClick(cat._id); }}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors z-10"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Remove Cat?"
        message="Are you sure? This will remove the cat from the website permanently."
        type="reject"
      />

      <ConfirmModal 
        isOpen={isAppModalOpen}
        onClose={() => setIsAppModalOpen(false)}
        onConfirm={executeStatusUpdate}
        title={pendingAppAction?.status === 'Approved' ? 'Approve Application?' : 'Reject Application?'}
        message={`Are you sure you want to mark this application as ${pendingAppAction?.status}?`}
        type={pendingAppAction?.status === 'Rejected' ? 'reject' : 'approve'} 
      />
    </div>
  );
}