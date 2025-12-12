'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function FavoriteButton({ catId }: { catId: string }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // 1. Check Login & Initial Status
  useEffect(() => {
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const res = await fetch(`/api/favorites/check?userId=${user.id}&catId=${catId}`);
        const data = await res.json();
        setIsFavorited(data.isFavorited);
      }
    };
    checkStatus();
  }, [catId]);

  // 2. Handle Click
  const toggleFavorite = async () => {
    if (!userId) {
      alert("Please log in to save favorites!");
      return;
    }

    // Optimistic UI update (change color immediately)
    const newState = !isFavorited;
    setIsFavorited(newState);

    await fetch('/api/favorites/toggle', {
      method: 'POST',
      body: JSON.stringify({ userId, catId })
    });
  };

  return (
    <button 
      onClick={toggleFavorite}
      className={`p-3 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 border ${
        isFavorited 
          ? 'bg-red-50 border-red-200 text-red-500' 
          : 'bg-white border-gray-100 text-gray-400 hover:text-red-300'
      }`}
      title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill={isFavorited ? "currentColor" : "none"} 
        viewBox="0 0 24 24" 
        stroke="currentColor" 
        className="w-8 h-8"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
}