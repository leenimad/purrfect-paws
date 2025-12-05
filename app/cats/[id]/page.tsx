import { notFound } from 'next/navigation';
import clientPromise from '../../../lib/mongodb';
import { Cat } from '../../../types';
import { ObjectId } from 'mongodb';
import AdoptButton from '@/components/AdoptButton';
import Image from 'next/image';
import Link from 'next/link';

// --- Helper Functions & Types ---

async function getCat(id: string): Promise<Cat | null> {
    if (!id || !ObjectId.isValid(id)) return null;
    try {
        const client = await clientPromise;
        const db = client.db('purrfect-paws');
        const cat = await db.collection('cats').findOne({ _id: new ObjectId(id) });
        if (!cat) return null;
        return JSON.parse(JSON.stringify(cat));
    } catch (error) {
        return null;
    }
}

type Props = {
    params: Promise<{ id: string }>
}

// --- Icons for visual appeal ---
const BackIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
);

const PawIcon = () => (
    <svg className="w-5 h-5 text-brand-purple mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);

// --- MAIN COMPONENT ---

export default async function CatProfilePage({ params }: Props) {
    const { id } = await params;
    const cat = await getCat(id);

    if (!cat) notFound();

    return (
        <div className="min-h-screen bg-gray-50">
            
            {/* 1. Navigation Breadcrumb */}
            <div className="container mx-auto px-4 py-6">
                <Link href="/" className="inline-flex items-center text-gray-600 hover:text-brand-purple transition-colors font-medium">
                    <BackIcon />
                    Back to all cats
                </Link>
            </div>

            {/* 2. Main Content Container */}
    {/* 2. Main Content Container */}
            <main className="container mx-auto px-4 pb-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        
                        {/* LEFT COLUMN: The Hero Image (FIXED) */}
                        {/* We changed bg-gray-100 to a purple tint and set a max-height */}
                        <div className="relative h-[400px] lg:h-[600px] bg-brand-purple-light/20">
                            <Image 
                                src={cat.imageUrls[0]} 
                                alt={cat.name} 
                                fill 
                                /* CHANGED: object-contain ensures the whole cat is seen. 
                                   p-4 adds a little breathing room like a photo frame. */
                                className="object-contain p-4"
                                priority
                            />
                            
                            {/* Floating Status Badge */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                                    cat.status === 'Available' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-yellow-500 text-white'
                                }`}>
                                    {cat.status}
                                </span>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: The Details (Same as before) */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            
                            {/* Header Info */}
                            <div className="mb-8">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                                    {cat.name}
                                </h1>
                                <p className="text-sm text-gray-500 font-medium mt-1">
                                Managed by: <span className="text-brand-purple">{cat.ownerName || 'Purrfect Paws Shelter'}</span>
                                </p>
                                <p className="text-xl text-brand-purple font-semibold">
                                    {cat.breed}
                                </p>
                            </div>

                            {/* Quick Stats Grid */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="bg-white p-4 rounded-2xl text-center border-2 border-brand-purple-light shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4">Age</p>
                                    <p className="text-lg font-bold text-brand-purple-dark">{cat.age} Yrs</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl text-center border-2 border-brand-purple-light shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4">Gender</p>
                                    <p className="text-lg font-bold text-brand-purple-dark">{cat.gender}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl text-center border-2 border-brand-purple-light shadow-sm">
                                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4 ">Color</p>
                                    <p className="text-lg font-bold text-brand-purple-dark">{cat.color}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                    <PawIcon /> About {cat.name}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    {cat.description}
                                </p>
                            </div>

                            {/* Medical Card */}
                            <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
                                <h3 className="text-md font-bold text-gray-900 mb-4">Medical Snapshot</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center text-gray-700">
                                        <CheckIcon />
                                        <span>Vaccinated: <strong>{cat.medicalHistory.vaccinations}</strong></span>
                                    </li>
                                    <li className="flex items-center text-gray-700">
                                        <CheckIcon />
                                        <span>Neutered: <strong>{cat.medicalHistory.spayedNeutered ? 'Yes' : 'No'}</strong></span>
                                    </li>
                                    <li className="flex items-start text-gray-700">
                                        <CheckIcon />
                                        <span>Notes: {cat.medicalHistory.healthNotes}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Call to Action */}
                            <div className="mt-auto">
                                {cat.status === 'Available' ? (
                                    <AdoptButton catId={cat._id!.toString()} />
                                ) : (
                                    <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed text-lg">
                                        Application Pending
                                    </button>
                                )}
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Adoption fee includes vaccination and carrier.
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
// import { notFound } from 'next/navigation';
// import clientPromise from '../../../lib/mongodb';
// import { Cat } from '../../../types';
// import { ObjectId } from 'mongodb';
// import AdoptButton from '@/components/AdoptButton';
// import Image from 'next/image';

// // Helper to fetch data
// async function getCat(id: string): Promise<Cat | null> {
//     // Added safety check for debugging
//     if (!id || !ObjectId.isValid(id)) {
//         console.error("Invalid ID passed to getCat:", id);
//         return null;
//     }

//     try {
//         const client = await clientPromise;
//         const db = client.db('purrfect-paws');
//         const cat = await db.collection('cats').findOne({ _id: new ObjectId(id) });
        
//         if (!cat) return null;
        
//         return JSON.parse(JSON.stringify(cat));
//     } catch (error) {
//         console.error("Database Error in getCat:", error);
//         return null;
//     }
// }

// // Medical Icon SVG
// const MedicalIcon = () => (
//     <svg className="w-6 h-6 text-brand-purple mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
// );

// // --- TYPE DEFINITION UPDATE ---
// // Next.js 15+ requires params to be a Promise
// type Props = {
//     params: Promise<{ id: string }>
// }

// export default async function CatProfilePage({ params }: Props) {
//     // --- CRITICAL FIX HERE ---
//     // We must await the params before using the ID
//     const { id } = await params; 

//     const cat = await getCat(id);
    
//     if (!cat) notFound();

//     return (
//         <div className="min-h-screen flex items-center justify-center py-12 px-4">
            
//             {/* The Main Card Container */}
//             <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full border-4 border-gray-100">
                
//                 {/* Header Section */}
//                 <div className="p-6 text-center">
//                     <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-800">{cat.name}'s Profile</h2>
//                 </div>

//                 {/* Purple Info Box */}
//                 <div className="mx-4 mb-4 bg-brand-purple-light rounded-2xl p-5">
                    
//                     {/* Cat Image */}
//                     <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6 shadow-sm border-2 border-white">
//                         <Image 
//                             src={cat.imageUrls[0]} 
//                             alt={cat.name} 
//                             fill 
//                             className="object-cover"
//                         />
//                     </div>

//                     {/* Details Grid */}
//                     <div className="space-y-2 text-sm text-gray-800 font-medium">
//                         <div className="flex justify-between">
//                             <span className="text-gray-500">Name:</span>
//                             <span className="font-bold">{cat.name}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-500">Age:</span>
//                             <span className="font-bold">{cat.age} years</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-500">Breed:</span>
//                             <span className="font-bold">{cat.breed}</span>
//                         </div>
//                          <div className="flex justify-between">
//                             <span className="text-gray-500">Color:</span>
//                             <span className="font-bold">{cat.color}</span>
//                         </div>
//                         <div className="flex justify-between">
//                             <span className="text-gray-500">Gender:</span>
//                             <span className="font-bold">{cat.gender}</span>
//                         </div>
//                     </div>

//                     {/* Description */}
//                     <p className="mt-4 text-sm text-gray-600 leading-relaxed border-t border-purple-200 pt-3">
//                         {cat.description}
//                     </p>

//                     {/* Medical History Section */}
//                     <div className="mt-4 bg-brand-purple-light/50 rounded-xl p-4 border border-purple-200">
//                         <div className="flex items-center mb-2">
//                             <MedicalIcon />
//                             <h3 className="font-bold text-brand-purple-dark">Medical History</h3>
//                         </div>
//                         <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
//                             <li>Vaccinations: {cat.medicalHistory.vaccinations}</li>
//                             <li>Spayed/Neutered: {cat.medicalHistory.spayedNeutered ? 'Yes' : 'No'}</li>
//                             <li>Notes: {cat.medicalHistory.healthNotes}</li>
//                         </ul>
//                     </div>

//                     {/* Adopt Button */}
//                     <div className="mt-6">
//                         {cat.status === 'Available' ? (
//                             <AdoptButton catId={cat._id!.toString()} />
//                         ) : (
//                             <div className="w-full bg-gray-400 text-white text-center font-bold py-3 px-6 rounded-xl cursor-not-allowed">
//                                 Adoption Pending
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }