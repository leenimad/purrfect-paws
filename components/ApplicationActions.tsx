'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmModal from './ConfirmModal'; // Import the new modal

interface Props {
  appId: string;
  catId: string;
  currentStatus: string;
}

export default function ApplicationActions({ appId, catId, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State for the Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  // 1. When user clicks a button, OPEN the modal instead of doing the action immediately
  const initiateAction = (type: 'approve' | 'reject') => {
    setActionType(type);
    setModalOpen(true);
  };

  // 2. The actual API call (runs only when they click "Yes" in the modal)
  const executeAction = async () => {
    if (!actionType) return;
    
    setLoading(true);
    // Map 'approve'/'reject' to API status 'Approved'/'Rejected'
    const apiStatus = actionType === 'approve' ? 'Approved' : 'Rejected';

    try {
      const res = await fetch('/api/admin/applications/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appId, status: apiStatus, catId }),
      });

      if (!res.ok) throw new Error('Failed to update');

      // Close modal and refresh
      setModalOpen(false);
      router.refresh();
      router.push('/admin'); // Go back to dashboard

    } catch (error) {
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Messages based on finished status
  if (currentStatus === 'Approved') {
    return <div className="bg-green-100 text-green-800 p-4 rounded-xl text-center font-bold border border-green-200">✅ Approved</div>;
  }
  if (currentStatus === 'Rejected') {
    return <div className="bg-red-100 text-red-800 p-4 rounded-xl text-center font-bold border border-red-200">❌ Rejected</div>;
  }

  return (
    <>
      {/* The Buttons on the Page */}
      <div className="flex gap-4 mt-8 border-t pt-8">
        <button
          onClick={() => initiateAction('reject')}
          className="flex-1 bg-white border-2 border-red-100 text-red-500 font-bold py-4 rounded-xl hover:bg-red-50 transition"
        >
          Reject Application
        </button>
        
        <button
          onClick={() => initiateAction('approve')}
          className="flex-1 bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 shadow-lg transition transform hover:scale-[1.02]"
        >
          Approve Adoption
        </button>
      </div>

      {/* The Modal Component */}
      <ConfirmModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeAction}
        isLoading={loading}
        type={actionType || 'approve'}
        title={actionType === 'approve' ? 'Approve Adoption?' : 'Reject Application?'}
        message={actionType === 'approve' 
          ? "This will mark the cat as adopted and notify the user. Are you sure?" 
          : "This will mark the application as rejected. This action cannot be undone."
        }
      />
    </>
  );
}