'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // useParams is safer!
import Link from 'next/link';
import Image from 'next/image';
import { Cat } from '../../../types';

export default function AdoptionFormPage() {
  const router = useRouter();
  const params = useParams(); // Hook to get ID safely
  const id = params.id as string;

  const [cat, setCat] = useState<Cat | null>(null);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    livingSituation: '',
    experience: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 1. Fetch Cat Data
  useEffect(() => {
    if (!id) return;
    
    async function fetchCat() {
      try {
        const res = await fetch(`/api/cats/${id}`);
        if (!res.ok) throw new Error('Cat not found');
        const data = await res.json();
        setCat(data);
      } catch (err) {
        setError('Could not load cat details.');
      } finally {
        setLoading(false);
      }
    }
    fetchCat();
  }, [id]);

  // 2. Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            ...formData, 
            catId: id, 
            catName: cat?.name 
        }),
      });

      if (!res.ok) throw new Error('Submission failed');

      router.push('/confirmation'); // Success!

    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-purple font-bold">Loading...</div>;
  if (!cat) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Cat not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
            <Link href={`/cats/${id}`} className="hover:text-brand-purple transition">
                &larr; Back to {cat.name}
            </Link>
            <span>/</span>
            <span className="font-semibold text-brand-purple">Apply to Adopt</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden grid md:grid-cols-3">
            
            {/* LEFT: Cat Summary Sidebar */}
            <div className="bg-brand-purple-light/20 p-8 md:col-span-1 border-r border-purple-100">
                <div className="relative w-full h-48 rounded-xl overflow-hidden mb-6 shadow-sm">
                     <Image src={cat.imageUrls[0]} alt={cat.name} fill className="object-cover" />
                </div>
                <h2 className="text-2xl font-extrabold text-gray-800 mb-1">{cat.name}</h2>
                <p className="text-brand-purple font-medium mb-4">{cat.breed}</p>
                
                <div className="text-sm text-gray-600 space-y-3 bg-white p-4 rounded-xl shadow-sm">
                    <p><strong>Age:</strong> {cat.age} years</p>
                    <p><strong>Gender:</strong> {cat.gender}</p>
                    <p><strong>Color:</strong> {cat.color}</p>
                </div>
                <p className="text-xs text-gray-400 mt-6 text-center">
                    Application Step 1 of 2
                </p>
            </div>

            {/* RIGHT: The Application Form */}
            <div className="p-8 md:col-span-2">
                <h1 className="text-3xl font-bold text-brand-purple mb-2">Adoption Application</h1>
                <p className="text-gray-500 mb-8">Please fill out this form honestly. We want to find the perfect match!</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <input type="text" name="applicantName" onChange={handleChange} required 
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition" placeholder="Jane Doe" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" name="applicantPhone" onChange={handleChange} required 
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition" placeholder="(555) 123-4567" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input type="email" name="applicantEmail" onChange={handleChange} required 
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition" placeholder="jane@example.com" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Living Situation</label>
                        <textarea name="livingSituation" rows={2} onChange={handleChange} required 
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition" placeholder="Do you live in a house or apartment? Do you have a yard?" />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Pet Experience</label>
                        <textarea name="experience" rows={2} onChange={handleChange} required 
                            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple outline-none transition" placeholder="Have you owned cats before?" />
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={isSubmitting} 
                            className="w-full bg-brand-purple text-white font-bold py-4 rounded-xl hover:bg-brand-purple-dark transition-all transform hover:scale-[1.01] shadow-lg disabled:opacity-50">
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
      </div>
    </div>
  );
}