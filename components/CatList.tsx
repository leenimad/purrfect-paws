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
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // How many cats per page?

  // 1. Reset to Page 1 if the user changes the filter
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // 2. Filter Logic
  const filteredCats = cats.filter(cat => {
    if (activeFilter === 'kitten') return cat.age < 1;
    if (activeFilter === 'adult') return cat.age >= 1;
    return true; // 'all'
  });

  // 3. Pagination Logic
  const totalPages = Math.ceil(filteredCats.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCats = filteredCats.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optional: Scroll to top of list smoothly when changing page
      document.getElementById('available-cats')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const FilterButton = ({ filter, label }: { filter: Filter, label: string }) => (
    <button
      onClick={() => setActiveFilter(filter)}
      className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 ${activeFilter === filter ? 'bg-brand-purple text-white shadow-md' : 'bg-white text-gray-700 hover:bg-brand-purple-light'}`}
    >
      {label}
    </button>
  );

  return (
    <section id="available-cats" className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Ready for a Home</h2>
        <p className="mt-2 text-lg text-gray-500">Meet our adorable cats waiting for a loving family.</p>
      </div>
      
      {/* Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-10">
        <FilterButton filter="all" label="All Cats" />
        <FilterButton filter="kitten" label="Kittens (Under 1yr)" />
        <FilterButton filter="adult" label="Adults (1yr+)" />
      </div>

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
                {/* Previous Button */}
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-brand-purple hover:text-white hover:border-brand-purple disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                >
                    &larr; Prev
                </button>

                {/* Page Numbers */}
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

                {/* Next Button */}
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
        <div className="text-center py-12 px-6 bg-white rounded-xl shadow-md">
          <h3 className="text-2xl font-semibold text-gray-800">No Cats Match Filter!</h3>
          <p className="text-gray-500 mt-2">
            It looks like we don't have any cats matching that criteria right now. 
            Try another filter!
          </p>
        </div>
      )}
    </section>
  );
}