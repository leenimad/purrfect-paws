
// // app/page.tsx
// import clientPromise from '../lib/mongodb';
// import { Cat } from '../types';
// import CatList from '@/components/CatList'; // Import our new client component
// import Image from 'next/image';
// import HeroSection from '@/components/HeroSection';

// // The server-side data fetching remains the same.
// async function getCats(): Promise<Cat[]> {
//   console.log("Attempting to fetch cats..."); // 1. Check if the function is running
//   try {
//     const client = await clientPromise;
//     const db = client.db('purrfect-paws');
//     const catsCollection = db.collection('cats');
    
//     const cats = await catsCollection
//       .find({ status: 'Available' })
//       .sort({ name: 1 })
//       .toArray();

//     // 2. THIS IS THE MOST IMPORTANT DEBUGGING STEP
//     console.log(`DATABASE QUERY COMPLETED: Found ${cats.length} cats with status 'Available'.`);
    
//     if (cats.length > 0) {
//       console.log("First cat found:", cats[0].name);
//     }

//     return JSON.parse(JSON.stringify(cats));
//   } catch (error) {
//     // 3. This will show us if the connection is failing
//     console.error("!!! DATABASE CONNECTION ERROR !!!", error);
//     return []; // Return an empty array on error
//   }
// }


// // Icon components for the "How it Works" section
// const Icon = ({ path }: { path: string }) => (
//     <svg className="w-12 h-12 text-brand-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path}></path></svg>
// );


// // --- The NEW Homepage Component ---
// export default async function HomePage() {
//   const availableCats = await getCats();

//   return (
//     <div className="space-y-24">
//       {/* Hero Section */}
      
//       <section className="relative pt-20 pb-24 overflow-hidden">
//             <div className="absolute inset-0 -z-10">
//             <Image 
//               src="/images/paws.png"  // <--- Make sure this matches your file name!
//               alt="Background pattern"
//               fill                       // This makes it stretch to cover the whole section
//               className="object-cover opacity-60" // Low opacity makes it subtle so text is readable
//               priority                   // Loads it immediately since it's at the top
//             />
//             {/* Optional: Add a gradient overlay so text pops even more */}
//             <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80"></div>
//           </div>


//           <div className="relative container mx-auto grid md:grid-cols-2 items-center gap-8">
//               <div className="text-center md:text-left animate-slide-in-up">
//                   <h1 className="text-5xl md:text-7xl font-extrabold text-brand-purple-dark tracking-tighter">
//                       Your Purrfect<br/>Companion Awaits.
//                   </h1>
//                   <p className="mt-4 max-w-lg mx-auto md:mx-0 text-xl text-gray-600">
//                       Discover adorable, healthy, and playful cats ready to bring joy to your home. The journey to unconditional love starts with a single paw step.
//                   </p>
//                   <a href="#available-cats" className="mt-8 inline-block bg-brand-purple text-white font-bold px-10 py-4 rounded-xl text-lg transition-transform duration-300 hover:scale-105 shadow-lg">
//                       Meet Them Now
//                   </a>
//               </div>
//               <div className="relative h-96 md:h-auto">
//                   <Image 
//                       src="/images/shadow.jpg" // You'll need to add a cool hero image!
//                       alt="A happy cat available for adoption"
//                       fill
//                       priority
//                       className="object-contain"
//                   />
//               </div>
//           </div>
//       </section>

//       {/* How it Works Section */}
//       <section id="how-it-works" className="text-center pt-32">
//         <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">A Simple Path to Adoption</h2>
//         <p className="mt-2 text-lg text-gray-500">Three easy steps to bring home your new family member.</p>
//         <div className="mt-12 grid md:grid-cols-3 gap-12">
//             <div className="opacity-0 animate-slide-in-up" style={{animationDelay: '0ms'}}>
//                 <div className="flex justify-center items-center h-24 w-24 mx-auto bg-brand-purple-light rounded-full">
//                     <Icon path="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </div>
//                 <h3 className="mt-6 text-xl font-bold">1. Find a Friend</h3>
//                 <p className="mt-2 text-gray-500">Browse our gallery of lovely cats. Filter by age to find your perfect match.</p>
//             </div>
//             <div className="opacity-0 animate-slide-in-up" style={{animationDelay: '200ms'}}>
//                 <div className="flex justify-center items-center h-24 w-24 mx-auto bg-brand-purple-light rounded-full">
//                     <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                 </div>
//                 <h3 className="mt-6 text-xl font-bold">2. Apply Online</h3>
//                 <p className="mt-2 text-gray-500">Fill out our straightforward adoption form. It’s quick, easy, and secure.</p>
//             </div>
//             <div className="opacity-0 animate-slide-in-up" style={{animationDelay: '400ms'}}>
//                 <div className="flex justify-center items-center h-24 w-24 mx-auto bg-brand-purple-light rounded-full">
//                     <Icon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                 </div>
//                 <h3 className="mt-6 text-xl font-bold">3. Welcome Home</h3>
//                 <p className="mt-2 text-gray-500">Once approved, you can schedule a pickup and welcome your new cat home.</p>
//             </div>
//         </div>
//       </section>

//       {/* This is where our interactive list goes. We pass the server-fetched cats as a prop. */}
//       <CatList cats={availableCats} />
//     </div>
//   );
// }
import clientPromise from '../lib/mongodb';
import { Cat } from '../types';
import HomeContent from '@/components/HomeContent'; // Import the new wrapper

async function getCats(): Promise<Cat[]> {
  const client = await clientPromise;
  const db = client.db('purrfect-paws');
  const cats = await db
    .collection('cats')
    .find({ status: 'Available' })
    .sort({ name: 1 })
    .toArray();
  return JSON.parse(JSON.stringify(cats));
}

export default async function HomePage() {
  const availableCats = await getCats();

  // We simply pass the data to the client component, 
  // which will handle the logic of WHO sees WHAT.
  return <HomeContent initialCats={availableCats} />;
}