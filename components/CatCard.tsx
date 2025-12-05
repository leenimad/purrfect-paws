// import Link from 'next/link';
// import { Cat } from '../types';

// interface CatCardProps {
//   cat: Cat;
// }

// export default function CatCard({ cat }: CatCardProps) {
//   const catId = cat._id!.toString();
//   return (
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1">
//       <div className="relative h-48 w-full">
//         {/* In a real app, you would use an Image component here */}
//         <img
//           src={cat.imageUrls[0] || '/images/placeholder.png'}
//           alt={`Photo of ${cat.name}`}
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="p-4">
//         <h3 className="text-xl font-bold text-gray-800">{cat.name}</h3>
//         <p className="text-gray-600 text-sm">{cat.breed}, {cat.age} years</p>
//         <Link 
//           href={`/cats/${catId}`} 
//           className="mt-4 inline-block bg-purple-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-purple-700 transition-colors w-full text-center"
//         >
//           View Profile
//         </Link>
//       </div>
//     </div>
//   );
// }
import Link from 'next/link';
import { Cat } from '../types';
import Image from 'next/image'; // Import the Next.js Image component

// A simple Paw Print icon component for visual flair
const PawIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5 inline-block">
        <path fillRule="evenodd" d="M9.315 7.584C10.82 6.513 12.872 6 15 6c2.128 0 4.18.513 5.685 1.584A12.012 12.012 0 0115 21a12.013 12.013 0 01-5.685-13.416zM5.685 7.584A12.013 12.013 0 000 21a12.012 12.012 0 0015-13.416C12.872 6.513 10.82 6 9 6c-2.128 0-4.18.513-5.685 1.584z" clipRule="evenodd" />
    </svg>
);


interface CatCardProps {
  cat: Cat;
}

export default function CatCard({ cat }: CatCardProps) {
  const catId = cat._id!.toString();
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 animate-fade-in">
      <Link href={`/cats/${catId}`} className="block">
        <div className="relative h-56 w-full">
          <Image
            src={cat.imageUrls[0] || '/images/shadow.png'}
            alt={`Photo of ${cat.name}`}
            fill // Use fill to cover the parent container
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover" // Ensure the image covers the area without distortion
          />
        </div>
        <div className="p-5">
          <h3 className="text-2xl font-bold text-gray-900 truncate">{cat.name}</h3>
          <p className="text-gray-500 mt-1">{cat.breed}</p>
          <div className="mt-4 flex items-center text-sm font-semibold text-brand-purple-dark">
              <PawIcon />
              <span>{cat.age} years old &bull; {cat.gender}</span>
          </div>
        </div>
        <div className="px-5 pb-5">
            <div className="bg-brand-purple text-white font-bold text-center w-full py-2.5 rounded-lg transition-colors duration-300 hover:bg-brand-purple-dark">
                View Profile
            </div>
        </div>
      </Link>
    </div>
  );
}