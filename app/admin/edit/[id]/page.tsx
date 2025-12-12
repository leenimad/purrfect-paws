'use client';

import { useState, useEffect, use } from 'react'; // Added 'use'
import { supabase } from '../../../../lib/supabase'; // Note the extra ../
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Helper to resolve params in Client Components (Next.js 15+)
export default function EditCatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); // Unwrap the params
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '', breed: '', age: '', color: '', gender: 'Male', description: '', imageUrls: ['']
  });

  // 1. Fetch Existing Data
  useEffect(() => {
    const fetchCat = async () => {
        const res = await fetch(`/api/cats/${id}`);
        if (res.ok) {
            const data = await res.json();
            setFormData({
                name: data.name,
                breed: data.breed,
                age: data.age,
                color: data.color,
                gender: data.gender,
                description: data.description,
                imageUrls: data.imageUrls || ['']
            });
        } else {
            alert("Cat not found!");
            router.push('/admin');
        }
        setLoading(false);
    };
    fetchCat();
  }, [id, router]);

  // 2. Handle Inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
        // Optional: Handle new photo upload here if you want to allow changing photos
        // For simplicity in this version, we keep the old photo unless logic is added.
        
        const res = await fetch(`/api/cats/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (!res.ok) throw new Error("Failed to update");

        setShowSuccessModal(true);

    } catch (error) {
        console.error(error);
        alert("Error updating cat.");
    } finally {
        setUpdating(false);
    }
  };

  if (loading) return <div className="p-20 text-center text-brand-purple font-bold">Loading Cat Details...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-brand-purple">Edit {formData.name}</h1>
        <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm font-bold">Cancel</Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Note: We skipped Photo Upload for edit to keep it simple, but you can add it back if needed */}
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Breed</label>
                <input type="text" name="breed" value={formData.breed} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Age</label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            </div>
            <div>
                <label className="block text-gray-700 text-sm font-bold mb-1">Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
            </div>
        </div>

        <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-lg">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </div>
        
        <div>
            <label className="block text-gray-700 text-sm font-bold mb-1">Description</label>
            <textarea 
                name="description" 
                rows={6} 
                value={formData.description} 
                onChange={handleChange} 
                required 
                className="w-full p-3 border rounded-lg bg-gray-50"
            />
        </div>

        <button type="submit" disabled={updating} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
          {updating ? 'Saving Changes...' : 'Update Cat'}
        </button>
      </form>

      {/* --- SUCCESS MODAL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border-4 border-blue-100 transform scale-100 transition-transform">
            
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Updated!</h2>
            <p className="text-gray-500 mb-8">
              The profile for <strong className="text-blue-600">{formData.name}</strong> has been successfully updated.
            </p>

            <Link 
                href={`/cats/${id}`} 
                className="block w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-lg"
            >
                View Updated Profile
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}