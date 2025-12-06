'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('applications'); // 'applications' or 'cats'
  const [applications, setApplications] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [catToDelete, setCatToDelete] = useState<string | null>(null);

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [pendingAppAction, setPendingAppAction] = useState<{appId: string, status: string, catId: string} | null>(null);

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);
    // Fetch Apps
    const appRes = await fetch('/api/admin/applications');
    const appData = await appRes.json();
    setApplications(appData);

    // Fetch Cats (Reusing our public API)
    const catRes = await fetch('/api/cats');
    const catData = await catRes.json();
    setCats(catData);
    
    setLoading(false);
  };
//

//
  useEffect(() => {
    // 2. Admin Check
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // REPLACE THIS WITH YOUR ACTUAL ADMIN EMAIL
      if (!user || user.email !== 'leeni.batta@gmail.com') {
        router.push('/'); // Kick out non-admins
      } else {
        fetchData();
      }
    };
    checkAdmin();
  }, [router]);

  // 3. Handle Status Update
// 1. User clicks "Approve" or "Reject" -> OPEN MODAL
  const confirmStatusUpdate = (appId: string, status: string, catId: string) => {
    setPendingAppAction({ appId, status, catId });
    setIsAppModalOpen(true);
  };

  // 2. User clicks "Yes" in Modal -> UPDATE SERVER
  const executeStatusUpdate = async () => {
    if (!pendingAppAction) return;

    // Close modal
    setIsAppModalOpen(false);
    const toastId = toast.loading(`Marking as ${pendingAppAction.status}...`);

    try {
        await fetch('/api/admin/applications/update', {
            method: 'PATCH',
            body: JSON.stringify({ 
                appId: pendingAppAction.appId, 
                status: pendingAppAction.status, 
                catId: pendingAppAction.catId 
            })
        });
        
        toast.success(`Application ${pendingAppAction.status}`, { id: toastId });
        fetchData(); // Refresh the list
    } catch (error) {
        toast.error("Failed to update status", { id: toastId });
    }
  };

  if (loading) return <div className="p-10 text-center text-brand-purple font-bold">Loading Admin Panel...</div>;

  // Open the modal
  const handleDeleteClick = (catId: string) => {
    setCatToDelete(catId);
    setIsDeleteModalOpen(true);

  };

  // Actually delete the cat (Called when user clicks "Yes")
  const executeDelete = async () => {
    if (!catToDelete) return;

    // Close modal immediately to feel responsive
    setIsDeleteModalOpen(false); 
    
    // Show loading toast
    const toastId = toast.loading('Deleting cat...');

    try {
      const res = await fetch(`/api/cats?id=${catToDelete}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete');

      toast.success('Cat removed successfully', { id: toastId });
      
      // Refresh the list automatically
      fetchData(); 

    } catch (error) {
      toast.error('Error deleting cat', { id: toastId });
    }
  };
return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800">Shelter Admin</h1>
            <Link href="/admin/add" className="bg-brand-purple text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-purple-dark shadow-lg">
                + Add New Cat
            </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
            <button 
                onClick={() => setActiveTab('applications')}
                className={`pb-2 px-4 font-bold ${activeTab === 'applications' ? 'text-brand-purple border-b-4 border-brand-purple' : 'text-gray-500'}`}
            >
                Applications ({applications.length})
            </button>
            <button 
                onClick={() => setActiveTab('cats')}
                className={`pb-2 px-4 font-bold ${activeTab === 'cats' ? 'text-brand-purple border-b-4 border-brand-purple' : 'text-gray-500'}`}
            >
                Manage Cats ({cats.length})
            </button>
        </div>

        {/* CONTENT: APPLICATIONS */}
        {activeTab === 'applications' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
                        <tr>
                            <th className="p-4">Applicant</th>
                            <th className="p-4">Cat</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <tr key={app._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <Link href={`/admin/applications/${app._id}`} className="font-bold hover:text-brand-purple underline">
                                        {app.applicantName}
                                    </Link>
                                    <div className="text-xs text-gray-500">{app.applicantEmail}</div>
                                </td>
                                <td className="p-4 font-medium text-brand-purple">{app.catName}</td>
                                <td className="p-4 text-sm text-gray-500">
                                    {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : 'Unknown'}
                                </td>
                                <td className="p-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {app.status || 'Pending'}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {(!app.status || app.status === 'Pending') && (
                                        <>
                                            <button 
                                            onClick={() => confirmStatusUpdate(app._id, 'Approved', app.catId)}
                className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 font-bold transition-transform hover:scale-105"
            >
                Approve
                                            </button>
                                            <button 
                                                 onClick={() => confirmStatusUpdate(app._id, 'Rejected', app.catId)}
                className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 font-bold transition-transform hover:scale-105"
            >
                Reject
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* CONTENT: CATS */}
        {activeTab === 'cats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cats.map((cat) => (
                    <div key={cat._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                            <div className="h-14 w-14 relative rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={cat.imageUrls[0]} alt={cat.name} fill className="object-cover" />
                            </div>
                            <div>
                                <div className="font-bold text-gray-800">{cat.name}</div>
                                <div className={`text-xs font-bold ${cat.status === 'Available' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {cat.status}
                                </div>
                            </div>
                        </div>

                        {/* Delete Button */}
                        <button 
                            onClick={() => handleDeleteClick(cat._id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* --- THE MODAL IS HERE --- */}
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
        // If status is 'Rejected', make button Red. If 'Approved', make it Green/Blue (default)
        type={pendingAppAction?.status === 'Rejected' ? 'reject' : 'approve'} 
      />

    </div>
  );
}

//   return (
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

//         {/* CONTENT: APPLICATIONS */}
//         {activeTab === 'applications' && (
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//                 <table className="w-full text-left">
//                     <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
//                         <tr>
//                             <th className="p-4">Applicant</th>
//                             <th className="p-4">Cat</th>
//                             <th className="p-4">Date</th>
//                             <th className="p-4">Status</th>
//                             <th className="p-4">Actions</th>
//                         </tr>
//                     </thead>
//   <tbody className="divide-y divide-gray-100">
//                         {applications.map((app) => (
//                             <tr key={app._id} className="hover:bg-gray-50">
//                                 {/* 1. Applicant Name (Fixed: No nested td) */}
//                                 <td className="p-4">
//                                     <Link href={`/admin/applications/${app._id}`} className="font-bold hover:text-brand-purple underline">
//                                         {app.applicantName}
//                                     </Link>
//                                     <div className="text-xs text-gray-500">{app.applicantEmail}</div>
//                                 </td>

//                                 {/* 2. Cat Name */}
//                                 <td className="p-4 font-medium text-brand-purple">{app.catName}</td>

//                                 {/* 3. Date */}
//                                 <td className="p-4 text-sm text-gray-500">
//                                     {app.submissionDate ? new Date(app.submissionDate).toLocaleDateString() : 'Unknown'}
//                                 </td>

//                                 {/* 4. Status */}
//                                 <td className="p-4">
//                                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${
//                                         app.status === 'Approved' ? 'bg-green-100 text-green-700' :
//                                         app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
//                                         'bg-yellow-100 text-yellow-700'
//                                     }`}>
//                                         {app.status || 'Pending'}
//                                     </span>
//                                 </td>

//                                 {/* 5. Actions */}
//                                 <td className="p-4 flex gap-2">
//                                     {(!app.status || app.status === 'Pending') && (
//                                         <>
//                                             <button 
//                                                 onClick={() => handleStatus(app._id, 'Approved', app.catId)}
//                                                 className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
//                                             >
//                                                 Approve
//                                             </button>
//                                             <button 
//                                                 onClick={() => handleStatus(app._id, 'Rejected', app.catId)}
//                                                 className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                                             >
//                                                 Reject
//                                             </button>
//                                         </>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         )}

//         {/* CONTENT: CATS */}
//         {/* CONTENT: CATS */}
//         {activeTab === 'cats' && (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {cats.map((cat) => (
//                     <div key={cat._id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex justify-between items-center">
                        
//                         {/* Left Side: Image & Name */}
//                         <div className="flex gap-4 items-center">
//                             <div className="h-14 w-14 relative rounded-lg overflow-hidden flex-shrink-0">
//                                 <Image src={cat.imageUrls[0]} alt={cat.name} fill className="object-cover" />
//                             </div>
//                             <div>
//                                 <div className="font-bold text-gray-800">{cat.name}</div>
//                                 <div className={`text-xs font-bold ${cat.status === 'Available' ? 'text-green-500' : 'text-yellow-500'}`}>
//                                     {cat.status}
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Right Side: DELETE BUTTON */}
//                         <button 
//                             onClick={() => handleDeleteClick(cat._id)}
//                             className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
//                             title="Delete Cat"
//                         >
//                             {/* Trash Icon */}
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
//                         </button>

//                     </div>
//                 ))}
//             </div>
//         )}
        
//       </div>
//        {/* <ConfirmModal 
//      isOpen={isDeleteModalOpen}
//      onClose={() => setIsDeleteModalOpen(false)}
//      onConfirm={executeDelete}
//      title="Remove Cat?"
//      message="This will permanently remove this cat and all its associated applications from the database."
//      type="reject" // Makes the button Red
//   />
//     </div>
//   );
  
// } */}
//      <ConfirmModal 
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         onConfirm={executeDelete}
//         type="reject"
//         title="Remove Cat?"
//         message="Are you sure? This will remove the cat from the website permanently. This action cannot be undone."
//       />

//     </div> // <-- This is the closing div of the main component
//   );
// }