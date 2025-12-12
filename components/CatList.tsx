// 'use client';

// import { useState, useEffect } from 'react';
// import { Cat } from '../types';
// import CatCard from './CatCard';

// type Filter = 'all' | 'kitten' | 'adult';

// interface CatListProps {
//   cats: Cat[];
// }

// export default function CatList({ cats }: CatListProps) {
//   const [activeFilter, setActiveFilter] = useState<Filter>('all');
  
//   // --- PAGINATION STATE ---
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 8; // How many cats per page?

//   // 1. Reset to Page 1 if the user changes the filter
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeFilter]);

//   // 2. Filter Logic
//   const filteredCats = cats.filter(cat => {
//     if (activeFilter === 'kitten') return cat.age < 1;
//     if (activeFilter === 'adult') return cat.age >= 1;
//     return true; // 'all'
//   });

//   // 3. Pagination Logic
//   const totalPages = Math.ceil(filteredCats.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentCats = filteredCats.slice(startIndex, startIndex + itemsPerPage);

//   const handlePageChange = (newPage: number) => {
//     if (newPage >= 1 && newPage <= totalPages) {
//       setCurrentPage(newPage);
//       // Optional: Scroll to top of list smoothly when changing page
//       document.getElementById('available-cats')?.scrollIntoView({ behavior: 'smooth' });
//     }
//   };

//   const FilterButton = ({ filter, label }: { filter: Filter, label: string }) => (
//     <button
//       onClick={() => setActiveFilter(filter)}
//       className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${activeFilter === filter ? 'bg-brand-purple text-white shadow-md' : 'bg-white text-gray-700 hover:bg-brand-purple-light'}`}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <section id="available-cats" className="py-16">
//       <div className="text-center mb-12">
//         <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Ready for a Home</h2>
//         <p className="mt-2 text-lg text-gray-500">Meet our adorable cats waiting for a loving family.</p>
//       </div>
      
//       {/* Filter Buttons */}
//       <div className="flex justify-center space-x-4 mb-10">
//         <FilterButton filter="all" label="All Cats" />
//         <FilterButton filter="kitten" label="Kittens (Under 1yr)" />
//         <FilterButton filter="adult" label="Adults (1yr+)" />
//       </div>

//       {currentCats.length > 0 ? (
//         <>
//           {/* THE GRID */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 min-h-[500px]">
//             {currentCats.map((cat, index) => (
//               <div key={cat._id!.toString()} className="opacity-0 animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
//                 <CatCard cat={cat} />
//               </div>
//             ))}
//           </div>

//           {/* THE PAGINATION CONTROLS */}
//           {totalPages > 1 && (
//              <div className="flex justify-center items-center mt-12 space-x-4">
//                 {/* Previous Button */}
//                 <button 
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-brand-purple hover:text-white hover:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
//                 >
//                     &larr; Prev
//                 </button>

//                 {/* Page Numbers */}
//                 <div className="flex space-x-2">
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                         <button
//                             key={page}
//                             onClick={() => handlePageChange(page)}
//                             className={`w-10 h-10 rounded-lg font-bold transition-all ${
//                                 currentPage === page 
//                                 ? 'bg-brand-purple text-white shadow-lg scale-110' 
//                                 : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
//                             }`}
//                         >
//                             {page}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Next Button */}
//                 <button 
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-brand-purple hover:text-white hover:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
//                 >
//                     Next &rarr;
//                 </button>
//              </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-12 px-6 bg-white rounded-xl shadow-md">
//           <h3 className="text-2xl font-semibold text-gray-800">No Cats Match Filter!</h3>
//           <p className="text-gray-500 mt-2">
//             It looks like we don't have any cats matching that criteria right now. 
//             Try another filter!
//           </p>
//         </div>
//       )}
//     </section>
//   );
// }
'use client';

import { useState, useEffect } from 'react';
import { Cat } from '../types';
import CatCard from './CatCard';

type Filter = 'all' | 'kitten' | 'adult';

interface CatListProps {
  cats: Cat[];
}

export default function CatList({ cats }: CatListProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [searchQuery, setSearchQuery] = useState(''); // NEW: Search State
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; 

  // 1. Reset to Page 1 if filter OR search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // 2. Filter Logic (Combines Type + Search)
  const filteredCats = cats.filter(cat => {
    // A. Type Filter
    let matchesType = true;
    if (activeFilter === 'kitten') matchesType = cat.age < 1;
    if (activeFilter === 'adult') matchesType = cat.age >= 1;

    // B. Search Filter (Name or Breed)
    const query = searchQuery.toLowerCase();
    const matchesSearch = cat.name.toLowerCase().includes(query) || 
                          cat.breed.toLowerCase().includes(query);

    return matchesType && matchesSearch;
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredCats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCats = filteredCats.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      document.getElementById('available-cats')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const FilterButton = ({ filter, label }: { filter: Filter, label: string }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 border ${
          activeFilter === filter 
          ? 'bg-brand-purple text-white shadow-md border-brand-purple' 
          : 'bg-white text-gray-600 border-gray-200 hover:bg-brand-purple-light hover:border-brand-purple'
      }`}
    >
      {label}
    </button>
  );

  return (
    <section id="available-cats" className="py-16">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Ready for a Home</h2>
        <p className="mt-2 text-lg text-gray-500">Meet our adorable cats waiting for a loving family.</p>
      </div>
      
      {/* --- CONTROLS SECTION (ALWAYS VISIBLE) --- */}
      <div className="container mx-auto max-w-4xl px-4 mb-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            
            {/* 1. Search Bar */}
            <div className="relative w-full md:w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input 
                    type="text" 
                    placeholder="Search by name or breed..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-purple focus:border-transparent outline-none transition-all"
                />
                {/* Clear 'X' Button (Only shows if typing) */}
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-brand-purple"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}
            </div>

            {/* 2. Filter Buttons */}
            <div className="flex space-x-2">
                <FilterButton filter="all" label="All" />
                <FilterButton filter="kitten" label="Kittens" />
                <FilterButton filter="adult" label="Adults" />
            </div>
        </div>
      </div>

      {/* --- RESULTS SECTION --- */}
      {currentCats.length > 0 ? (
        <>
          {/* THE GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 min-h-[500px]">
            {currentCats.map((cat, index) => (
              <div key={cat._id!.toString()} className="opacity-0 animate-slide-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CatCard cat={cat} />
              </div>
            ))}
          </div>

          {/* THE PAGINATION CONTROLS */}
          {totalPages > 1 && (
             <div className="flex justify-center items-center mt-12 space-x-4">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-brand-purple hover:text-white hover:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                >
                    &larr; Prev
                </button>

                <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                currentPage === page 
                                ? 'bg-brand-purple text-white shadow-lg scale-110' 
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-brand-purple hover:text-white hover:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                >
                    Next &rarr;
                </button>
             </div>
          )}
        </>
      ) : (
        /* --- EMPTY STATE (Now includes a reset button) --- */
        <div className="text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800">No Cats Found</h3>
          <p className="text-gray-500 mt-2">
            We couldn't find any cats matching <strong>"{searchQuery}"</strong> with the selected filter.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setActiveFilter('all'); }}
            className="mt-6 bg-brand-purple text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-purple-dark transition"
          >
            Clear Filters & Search
          </button>
        </div>
      )}
    </section>
  );
}