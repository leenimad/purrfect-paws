'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type: 'approve' | 'reject';
  isLoading?: boolean;
}

export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  type,
  isLoading 
}: ConfirmModalProps) {
  
  if (!isOpen) return null;

  const isApprove = type === 'approve';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className={`p-6 text-center ${isApprove ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isApprove ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {isApprove ? (
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            ) : (
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            )}
          </div>
          <h3 className={`text-2xl font-bold ${isApprove ? 'text-green-800' : 'text-red-800'}`}>
            {title}
          </h3>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-gray-600 text-lg mb-8">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 py-3 px-4 text-white font-bold rounded-xl shadow-lg transition transform hover:scale-[1.02] ${
                isApprove 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isLoading ? 'Processing...' : isApprove ? 'Yes, Approve' : 'Yes, Reject'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}