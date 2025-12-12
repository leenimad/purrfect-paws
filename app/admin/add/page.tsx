
'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddCatPage() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [keywords, setKeywords] = useState('');
  
  // Manual AI Loading State
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- NEW: SUCCESS MODAL STATE ---
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '', breed: '', age: '', color: '', gender: 'Male', description: '',
  });

  // ... (Keep your existing handleGenerateDescription logic here) ...
  const handleGenerateDescription = async () => {
    if (!keywords) return alert("Please enter some keywords first!");
    setIsAiLoading(true);
    const prompt = `Write a heartwarming, short adoption description for a cat. Keywords: "${keywords}". Tone: appealing, friendly. Length: 2-3 sentences.`;
    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI generation failed');
      setFormData(prev => ({ ...prev, description: data.text }));
    } catch (err: any) {
      console.error(err);
      alert('Failed to generate description: ' + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);

    const fileInput = e.currentTarget.elements.namedItem('photo') as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      alert('Please select an image');
      setUploading(false);
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('cat-images').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('cat-images').getPublicUrl(fileName);
      
      const res = await fetch('/api/cats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrls: [urlData.publicUrl] }),
      });
      if (!res.ok) throw new Error('Failed to save cat');

      // --- CHANGED: SHOW MODAL INSTEAD OF ALERT ---
      setShowSuccessModal(true);

    } catch (error) {
      console.error(error);
      alert('Error adding cat');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-10 relative">
      <h1 className="text-3xl font-bold text-brand-purple mb-6">Add a New Cat</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ... (Keep all your existing inputs exactly the same) ... */}
        <div>
          <label className="block text-gray-700 font-bold mb-2">Cat Photo</label>
          <input type="file" name="photo" accept="image/*" required className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-purple-light file:text-brand-purple hover:file:bg-brand-purple-light/50"/>
        </div>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input type="text" name="breed" placeholder="Breed" value={formData.breed} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input type="number" name="age" placeholder="Age (years)" value={formData.age} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <input type="text" name="color" placeholder="Color" value={formData.color} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 border rounded-lg">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
        </select>

        <div className="bg-brand-purple-light/50 p-4 rounded-xl border border-brand-purple-light">
            <label className="block text-gray-700 font-bold mb-2">AI Description Generator ✨</label>
            <div className="flex gap-2">
                <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., Cuddly..." className="w-full p-2 border rounded-lg"/>
                <button type="button" onClick={handleGenerateDescription} disabled={isAiLoading} className="bg-brand-purple text-white font-bold px-4 rounded-lg hover:bg-brand-purple-dark transition disabled:opacity-50">
                    {isAiLoading ? 'Writing...' : 'Generate'}
                </button>
            </div>
        </div>
        
        <textarea name="description" placeholder="Cat's story..." rows={4} value={formData.description} onChange={handleChange} required className="w-full p-3 border rounded-lg bg-gray-50"/>

        <button type="submit" disabled={uploading || isAiLoading} className="w-full bg-brand-purple text-white font-bold py-3 rounded-lg hover:bg-brand-purple-dark transition-colors disabled:opacity-50">
          {uploading ? 'Uploading...' : 'Add Cat'}
        </button>
      </form>

      {/* --- THE CUTE SUCCESS MODAL --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center border-4 border-brand-purple-light transform scale-100 transition-transform">
            
            {/* Animated Checkmark */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Cat Added! 🎉</h2>
            <p className="text-gray-500 mb-8">
              <strong className="text-brand-purple">{formData.name}</strong> is now live on the website and ready to find a home.
            </p>

            <div className="space-y-3">
                <Link 
                    href="/admin" 
                    className="block w-full bg-brand-purple text-white font-bold py-3 rounded-xl hover:bg-brand-purple-dark transition shadow-lg"
                >
                    Back to Dashboard
                </Link>
                <button 
                    onClick={() => {
                        setShowSuccessModal(false);
                        setFormData({name: '', breed: '', age: '', color: '', gender: 'Male', description: ''}); // Reset form
                    }}
                    className="block w-full bg-white text-gray-500 font-bold py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                    Add Another Cat
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// 'use client';

// import { useState } from 'react';
// import { supabase } from '../../../lib/supabase';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { useCompletion } from 'ai/react';

// export default function AddCatPage() {
//   const router = useRouter();
//   const [uploading, setUploading] = useState(false);
  
//   // Updated State to include Medical Data
//   const [formData, setFormData] = useState({
//     name: '',
//     breed: '',
//     age: '',
//     color: '',
//     gender: 'Male',
//     description: '',
//     // Medical Fields
//     vaccinations: '',
//     spayedNeutered: 'Yes', // Default string for dropdown
//     healthNotes: ''
//   });
//  const { completion, complete } = useCompletion({
//     api: '/api/generate-description',
//     onFinish: (prompt, result) => {
//         // When AI finishes, update the form's description
//         setFormData(prev => ({ ...prev, description: result }));
//     }
//   });

//   const handleGenerateDescription = async () => {
//     if (!keywords) {
//         alert("Please enter some keywords first!");
//         return;
//     }
//     const prompt = `Write a heartwarming, short adoption description for a cat. The cat's personality and appearance can be described with these keywords: "${keywords}". Make it sound appealing to potential adopters. Keep it to 2-3 sentences.`;
//     complete(prompt);
//   };
//   // --- End of AI Logic ---

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   //   e.preventDefault();
//   //   setUploading(true);

//   //   // 1. Get Current User (Shelter/Admin)
//   //   const { data: { user } } = await supabase.auth.getUser();

//   //   if (!user) {
//   //       alert("You must be logged in to add a cat.");
//   //       router.push('/login');
//   //       return;
//   //   }

//   //   const form = e.currentTarget;
//   //   const fileInput = Array.from(form.elements).find((element) => 
//   //     (element as HTMLInputElement).name === 'photo'
//   //   ) as HTMLInputElement;

//   //   const file = fileInput.files?.[0];

//   //   if (!file) {
//   //        toast.error('Please select an image first!');
//   //     setUploading(false);
//   //     return;
//   //   }

//   //   try {
//   //     // 2. Upload Image to Supabase
//   //     const fileExt = file.name.split('.').pop();
//   //     const fileName = `${Date.now()}.${fileExt}`;
//   //     const { error: uploadError } = await supabase.storage
//   //       .from('cat-images')
//   //       .upload(fileName, file);

//   //     if (uploadError) throw uploadError;

//   //     // 3. Get Public URL
//   //     const { data: urlData } = supabase.storage
//   //       .from('cat-images')
//   //       .getPublicUrl(fileName);

//   //     const publicUrl = urlData.publicUrl;

//   //     // 4. Save to MongoDB
//   //     const res = await fetch('/api/cats', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({
//   //         name: formData.name,
//   //         breed: formData.breed,
//   //         age: formData.age,
//   //         color: formData.color,
//   //         gender: formData.gender,
//   //         description: formData.description,
//   //         imageUrls: [publicUrl],
//   //         ownerId: user.id,
//   //         ownerEmail: user.email,
//   //         // Construct the nested medicalHistory object
//   //         medicalHistory: {
//   //           vaccinations: formData.vaccinations,
//   //           spayedNeutered: formData.spayedNeutered === 'Yes', // Convert string to boolean
//   //           healthNotes: formData.healthNotes
//   //         }
//   //       }),
//   //     });

//   //     if (!res.ok) {
//   //       const errorData = await res.json();
//   //       throw new Error(errorData.error || 'Failed to save cat');
//   //     }

//   //      toast.success('Cat added successfully! 🐱');
//   //     router.push('/dashboard'); // Go to dashboard to see it

//   //   } catch (error: any) {
//   //     console.error(error);
//   //     toast.error(error.message);
//   //   } finally {
//   //     setUploading(false);
//   //   }
//   // };
// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     // FIX: Capture the form element IMMEDIATELY, before any await
//     const form = e.currentTarget;
    
//     setUploading(true);

//     // 1. Get Current User (Shelter/Admin)
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//         alert("You must be logged in to add a cat.");
//         router.push('/login');
//         return;
//     }

//     // Now we use the 'form' variable we saved earlier, instead of e.currentTarget
//     const fileInput = Array.from(form.elements).find((element) => 
//       (element as HTMLInputElement).name === 'photo'
//     ) as HTMLInputElement;

//     const file = fileInput.files?.[0];

//     if (!file) {
//       toast.error('Please select an image first!');
//       setUploading(false);
//       return;
//     }

//     try {
//       // 2. Upload Image to Supabase
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${Date.now()}.${fileExt}`;
//       const { error: uploadError } = await supabase.storage
//         .from('cat-images')
//         .upload(fileName, file);

//       if (uploadError) throw uploadError;

//       // 3. Get Public URL
//       const { data: urlData } = supabase.storage
//         .from('cat-images')
//         .getPublicUrl(fileName);

//       const publicUrl = urlData.publicUrl;

//       // 4. Save to MongoDB
//       const res = await fetch('/api/cats', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name: formData.name,
//           breed: formData.breed,
//           age: formData.age,
//           color: formData.color,
//           gender: formData.gender,
//           description: formData.description,
//           imageUrls: [publicUrl],
//           ownerId: user.id,
//           ownerEmail: user.email,
//           medicalHistory: {
//             vaccinations: formData.vaccinations,
//             spayedNeutered: formData.spayedNeutered === 'Yes',
//             healthNotes: formData.healthNotes
//           }
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.error || 'Failed to save cat');
//       }

//       toast.success('Cat added successfully! 🐱');
//       router.push('/dashboard'); 

//     } catch (error: any) {
//       console.error(error);
//       toast.error(error.message);
//     } finally {
//       setUploading(false);
//     }
//   };
//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
//         <h1 className="text-3xl font-extrabold text-brand-purple mb-8 text-center">Upload New Cat</h1>
        
//         <form onSubmit={handleSubmit} className="space-y-8">
          
//           {/* SECTION 1: PHOTO */}
//           <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
//             <label className="block text-gray-700 font-bold mb-2">Cat Photo</label>
//             <input 
//                 type="file" 
//                 name="photo" 
//                 accept="image/*" 
//                 required 
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-brand-purple file:text-white hover:file:bg-brand-purple-dark transition cursor-pointer"
//             />
//           </div>

//           {/* SECTION 2: BASIC DETAILS */}
//           <div className="space-y-4">
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Basic Details</h2>
            
//             <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
//                     <input type="text" name="name" placeholder="e.g. Whiskers" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
//                 </div>
//                 <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Breed</label>
//                     <input type="text" name="breed" placeholder="e.g. Tabby" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
//                 </div>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//                 <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age (Years)</label>
//                     <input type="number" name="age" placeholder="2" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
//                 </div>
//                 <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Color</label>
//                     <input type="text" name="color" placeholder="e.g. Orange" onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
//                 </div>
//                 <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
//                     <select name="gender" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none bg-white">
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                     </select>
//                 </div>
//             </div>

//             <div>
//                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description & Personality</label>
//                 <textarea name="description" placeholder="Tell us about this cat's personality..." rows={4} onChange={handleChange} required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none"></textarea>
//             </div>
//           </div>

//           {/* SECTION 3: MEDICAL HISTORY */}
//           <div className="space-y-4">
//             <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Medical History</h2>
            
//             <div className="grid md:grid-cols-2 gap-4">
//                 <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vaccinations</label>
//                     <input type="text" name="vaccinations" placeholder="e.g. Rabies, Distemper" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none" />
//                 </div>
//                 <div>
//                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Spayed / Neutered?</label>
//                     <select name="spayedNeutered" onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none bg-white">
//                         <option value="Yes">Yes</option>
//                         <option value="No">No</option>
//                     </select>
//                 </div>
//             </div>
//             <div>
//                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Health Notes</label>
//                 <textarea name="healthNotes" placeholder="Any chronic conditions, allergies, or recent checkups?" rows={2} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none"></textarea>
//             </div>
//           </div>

//           <button type="submit" disabled={uploading} className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl hover:bg-brand-purple-dark transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg">
//             {uploading ? 'Uploading Cat...' : '✨ Publish Cat Listing'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
