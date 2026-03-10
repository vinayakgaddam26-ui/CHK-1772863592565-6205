'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/city/${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full group">
      <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/50 group-hover:text-carbon-primary hover:shadow-[0_0_10px_rgba(123,63,228,0.4)] transition">
        <Search className="w-5 h-5" />
      </button>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Explore global carbon hotspots..." 
        className="w-full bg-carbon-800/80 border border-white/10 text-white rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:border-carbon-primary focus:shadow-[0_0_20px_rgba(123,63,228,0.2)] transition"
      />
    </form>
  );
}
