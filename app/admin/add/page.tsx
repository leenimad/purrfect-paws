'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function AddCatPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  
  // Updated State to include Medical Data
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    color: '',
    gender: 'Male',
    description: '',
    // Medical Fields
    vaccinations: '',
    spayedNeutered: 'Yes', // Default string for dropdown
    healthNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setUploading(true);

  //   // 1. Get Current User (Shelter/Admin)
  //   const { data: { user } } = await supabase.auth.getUser();

  //   if (!user) {
  //       alert("You must be logged in to add a cat.");
  //       router.push('/login');
  //       return;
  //   }

  //   const form = e.currentTarget;
  //   const fileInput = Array.from(form.elements).find((element) => 
  //     (element as HTMLInputElement).name === 'photo'
  //   ) as HTMLInputElement;

  //   const file = fileInput.files?.[0];

  //   if (!file) {
  //        toast.error('Please select an image first!');
  //     setUploading(false);
  //     return;
  //   }

  //   try {
  //     // 2. Upload Image to Supabase
  //     const fileExt = file.name.split('.').pop();
  //     const fileName = `${Date.now()}.${fileExt}`;
  //     const { error: uploadError } = await supabase.storage
  //       .from('cat-images')
  //       .upload(fileName, file);

  //     if (uploadError) throw uploadError;

  //     // 3. Get Public URL
  //     const { data: urlData } = supabase.storage
  //       .from('cat-images')
  //       .getPublicUrl(fileName);

  //     const publicUrl = urlData.publicUrl;

  //     // 4. Save to MongoDB
  //     const res = await fetch('/api/cats', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         name: formData.name,
  //         breed: formData.breed,
  //         age: formData.age,
  //         color: formData.color,
  //         gender: formData.gender,
  //         description: formData.description,
  //         imageUrls: [publicUrl],
  //         ownerId: user.id,
  //         ownerEmail: user.email,
  //         // Construct the nested medicalHistory object
  //         medicalHistory: {
  //           vaccinations: formData.vaccinations,
  //           spayedNeutered: formData.spayedNeutered === 'Yes', // Convert string to boolean
  //           healthNotes: formData.healthNotes
  //         }
  //       }),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.error || 'Failed to save cat');
  //     }

  //      toast.success('Cat added successfully! 🐱');
  //     router.push('/dashboard'); // Go to dashboard to see it

  //   } catch (error: any) {
  //     console.error(error);
  //     toast.error(error.message);
  //   } finally {
  //     setUploading(false);
  //   }
  // };
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // FIX: Capture the form element IMMEDIATELY, before any await
    const form = e.currentTarget;
    
    setUploading(true);

    // 1. Get Current User (Shelter/Admin)
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        alert("You must be logged in to add a cat.");
        router.push('/login');
        return;
    }

    // Now we use the 'form' variable we saved earlier, instead of e.currentTarget
    const fileInput = Array.from(form.elements).find((element) => 
      (element as HTMLInputElement).name === 'photo'
    ) as HTMLInputElement;

    const file = fileInput.files?.[0];

    if (!file) {
      toast.error('Please select an image first!');
      setUploading(false);
      return;
    }

    try {
      // 2. Upload Image to Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('cat-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 3. Get Public URL
      const { data: urlData } = supabase.storage
        .from('cat-images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // 4. Save to MongoDB
      const res = await fetch('/api/cats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          breed: formData.breed,
          age: formData.age,
          color: formData.color,
          gender: formData.gender,
          description: formData.description,
          imageUrls: [publicUrl],
          ownerId: user.id,
          ownerEmail: user.email,
          medicalHistory: {
            vaccinations: formData.vaccinations,
            spayedNeutered: formData.spayedNeutered === 'Yes',
            healthNotes: formData.healthNotes
          }
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save cat');
      }

      toast.success('Cat added successfully! 🐱');
      router.push('/dashboard'); 

    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <h1 className="text-3xl font-extrabold text-brand-purple mb-8 text-center">Upload New Cat</h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* SECTION 1: PHOTO */}
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
            <label className="block text-gray-700 font-bold mb-2">Cat Photo</label>
            <input 
                type="file" 
                name="photo" 
                accept="image/*" 
                required 
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-purple file:text-white hover:file:bg-brand-purple-dark transition cursor-pointer"
            />
          </div>

          {/* SECTION 2: BASIC DETAILS */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Basic Details</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                    <input type="text" name="name" placeholder="e.g. Whiskers" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Breed</label>
                    <input type="text" name="breed" placeholder="e.g. Tabby" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age (Years)</label>
                    <input type="number" name="age" placeholder="2" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color</label>
                    <input type="text" name="color" placeholder="e.g. Orange" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                    <select name="gender" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none bg-white">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description & Personality</label>
                <textarea name="description" placeholder="Tell us about this cat's personality..." rows={4} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none"></textarea>
            </div>
          </div>

          {/* SECTION 3: MEDICAL HISTORY */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Medical History</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vaccinations</label>
                    <input type="text" name="vaccinations" placeholder="e.g. Rabies, Distemper" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Spayed / Neutered?</label>
                    <select name="spayedNeutered" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none bg-white">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Health Notes</label>
                <textarea name="healthNotes" placeholder="Any chronic conditions, allergies, or recent checkups?" rows={2} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none"></textarea>
            </div>
          </div>

          <button type="submit" disabled={uploading} className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl hover:bg-brand-purple-dark transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg">
            {uploading ? 'Uploading Cat...' : '✨ Publish Cat Listing'}
          </button>
        </form>
      </div>
    </div>
  );
}