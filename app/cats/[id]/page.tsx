import { notFound } from 'next/navigation';
import clientPromise from '../../../lib/mongodb';
import { Cat } from '../../../types';
import { ObjectId } from 'mongodb';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from '@/components/FavoriteButton';
import CatProfileActions from '@/components/CatProfileActions'; // <--- NEW IMPORT

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

// --- Icons ---
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
            <main className="container mx-auto px-4 pb-20">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        
                        {/* LEFT COLUMN: The Hero Image */}
                        <div className="relative h-[400px] lg:h-[600px] bg-brand-purple-light/20">
                            <Image 
                                src={cat.imageUrls[0]} 
                                alt={cat.name} 
                                fill 
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

                        {/* RIGHT COLUMN: The Details */}
                        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            
                            {/* Header Info */}
                            <div className="mb-8 flex justify-between items-start">
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
                                        {cat.name}
                                    </h1>
                                    <p className="text-xl text-brand-purple font-semibold">
                                        {cat.breed}
                                    </p>
                                </div>
                                {/* The Heart Button */}
                                <FavoriteButton catId={cat._id!.toString()} />
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

                            {/* Call to Action (NOW USES SMART COMPONENT) */}
                            <div className="mt-auto">
                                <CatProfileActions catId={cat._id!.toString()} catStatus={cat.status} />
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
// import Link from 'next/link';
// import FavoriteButton from '@/components/FavoriteButton';

// // --- Helper Functions & Types ---

// async function getCat(id: string): Promise<Cat | null> {
//     if (!id || !ObjectId.isValid(id)) return null;
//     try {
//         const client = await clientPromise;
//         const db = client.db('purrfect-paws');
//         const cat = await db.collection('cats').findOne({ _id: new ObjectId(id) });
//         if (!cat) return null;
//         return JSON.parse(JSON.stringify(cat));
//     } catch (error) {
//         return null;
//     }
// }

// type Props = {
//     params: Promise<{ id: string }>
// }

// // --- Icons for visual appeal ---
// const BackIcon = () => (
//     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
// );

// const PawIcon = () => (
//     <svg className="w-5 h-5 text-brand-purple mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
// );

// const CheckIcon = () => (
//     <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
// );

// // --- MAIN COMPONENT ---

// export default async function CatProfilePage({ params }: Props) {
//     const { id } = await params;
//     const cat = await getCat(id);

//     if (!cat) notFound();

//     return (
//         <div className="min-h-screen bg-gray-50">
            
//             {/* 1. Navigation Breadcrumb */}
//             <div className="container mx-auto px-4 py-6">
//                 <Link href="/" className="inline-flex items-center text-gray-600 hover:text-brand-purple transition-colors font-medium">
//                     <BackIcon />
//                     Back to all cats
//                 </Link>
//             </div>

//             {/* 2. Main Content Container */}
//     {/* 2. Main Content Container */}
//             <main className="container mx-auto px-4 pb-20">
//                 <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
//                     <div className="grid grid-cols-1 lg:grid-cols-2">
                        
//                         {/* LEFT COLUMN: The Hero Image (FIXED) */}
//                         {/* We changed bg-gray-100 to a purple tint and set a max-height */}
//                         <div className="relative h-[400px] lg:h-[600px] bg-brand-purple-light/20">
//                             <Image 
//                                 src={cat.imageUrls[0]} 
//                                 alt={cat.name} 
//                                 fill 
//                                 /* CHANGED: object-contain ensures the whole cat is seen. 
//                                    p-4 adds a little breathing room like a photo frame. */
//                                 className="object-contain p-4"
//                                 priority
//                             />
                            
//                             {/* Floating Status Badge */}
//                             <div className="absolute top-6 left-6 z-10">
//                                 <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
//                                     cat.status === 'Available' 
//                                     ? 'bg-green-500 text-white' 
//                                     : 'bg-yellow-500 text-white'
//                                 }`}>
//                                     {cat.status}
//                                 </span>
//                             </div>
//                         </div>

//                         {/* RIGHT COLUMN: The Details (Same as before) */}
//                         <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                            
                          
//                        {/* Header Info */}
//                             <div className="mb-8 flex justify-between items-start">
//                                 <div>
//                                     <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
//                                         {cat.name}
//                                     </h1>
//                                     <p className="text-xl text-brand-purple font-semibold">
//                                         {cat.breed}
//                                     </p>
//                                 </div>
//                                 {/* The Heart Button */}
//                                 <FavoriteButton catId={cat._id!.toString()} />
//                             </div>

//                             {/* Quick Stats Grid */}
//                             <div className="grid grid-cols-3 gap-4 mb-8">
//                                 <div className="bg-white p-4 rounded-2xl text-center border-2 border-brand-purple-light shadow-sm">
//                                     <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4">Age</p>
//                                     <p className="text-lg font-bold text-brand-purple-dark">{cat.age} Yrs</p>
//                                 </div>
//                                 <div className="bg-white p-4 rounded-2xl text-center border-2 border-brand-purple-light shadow-sm">
//                                     <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4">Gender</p>
//                                     <p className="text-lg font-bold text-brand-purple-dark">{cat.gender}</p>
//                                 </div>
//                                 <div className="bg-white p-4 rounded-2xl text-center border-2 border-brand-purple-light shadow-sm">
//                                     <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-4 ">Color</p>
//                                     <p className="text-lg font-bold text-brand-purple-dark">{cat.color}</p>
//                                 </div>
//                             </div>

//                             {/* Description */}
//                             <div className="mb-8">
//                                 <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
//                                     <PawIcon /> About {cat.name}
//                                 </h3>
//                                 <p className="text-gray-600 leading-relaxed text-lg">
//                                     {cat.description}
//                                 </p>
//                             </div>

//                             {/* Medical Card */}
//                             <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
//                                 <h3 className="text-md font-bold text-gray-900 mb-4">Medical Snapshot</h3>
//                                 <ul className="space-y-3">
//                                     <li className="flex items-center text-gray-700">
//                                         <CheckIcon />
//                                         <span>Vaccinated: <strong>{cat.medicalHistory.vaccinations}</strong></span>
//                                     </li>
//                                     <li className="flex items-center text-gray-700">
//                                         <CheckIcon />
//                                         <span>Neutered: <strong>{cat.medicalHistory.spayedNeutered ? 'Yes' : 'No'}</strong></span>
//                                     </li>
//                                     <li className="flex items-start text-gray-700">
//                                         <CheckIcon />
//                                         <span>Notes: {cat.medicalHistory.healthNotes}</span>
//                                     </li>
//                                 </ul>
//                             </div>

//                             {/* Call to Action */}
//                             <div className="mt-auto">
//                                 {cat.status === 'Available' ? (
//                                     <AdoptButton catId={cat._id!.toString()} />
//                                 ) : (
//                                     <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-4 rounded-xl cursor-not-allowed text-lg">
//                                         Application Pending
//                                     </button>
//                                 )}
//                                 <p className="text-center text-xs text-gray-400 mt-4">
//                                     Adoption fee includes vaccination and carrier.
//                                 </p>
//                             </div>

//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// }
