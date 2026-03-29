'use client';

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTMA } from '@/components/TMAProvider';
import { MovieCard } from '@/components/MovieCard';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Search, Film, Star, Play } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const { user, isReady } = useTMA();
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];

  useEffect(() => {
    const q = query(collection(db, 'movies'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const movieData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMovies(movieData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || movie.genre === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredMovie = movies.find(m => m.is_featured) || movies[0];

  if (!isReady) return <SkeletonLoader type="full" />;

  return (
    <div className="pb-20">
      {/* Search Bar */}
      <div className="p-4 sticky top-0 z-10 bg-[var(--tg-theme-bg-color)]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--tg-theme-hint-color)]" />
          <input
            type="text"
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[var(--tg-theme-secondary-bg-color)] border-none focus:ring-2 focus:ring-[var(--tg-theme-button-color)] text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Featured Movie */}
      {featuredMovie && !searchQuery && (
        <div className="px-4 mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
          >
            <img 
              src={featuredMovie.poster_url} 
              alt={featuredMovie.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-[var(--tg-theme-button-color)] text-white text-[10px] font-bold rounded uppercase">Featured</span>
                {featuredMovie.is_premium && (
                  <span className="px-2 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded uppercase flex items-center gap-1">
                    <Star className="w-2 h-2 fill-current" /> Premium
                  </span>
                )}
              </div>
              <h1 className="text-white text-2xl font-bold mb-1">{featuredMovie.title}</h1>
              <p className="text-white/70 text-xs line-clamp-2 mb-3">{featuredMovie.description}</p>
              <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold">
                <Play className="w-4 h-4 fill-current" /> Watch Now
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto px-4 mb-6 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat 
                ? 'bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]' 
                : 'bg-[var(--tg-theme-secondary-bg-color)] text-[var(--tg-theme-text-color)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Film className="w-5 h-5 text-[var(--tg-theme-button-color)]" />
            {activeCategory === 'All' ? 'Latest Movies' : activeCategory}
          </h2>
          <span className="text-xs text-[var(--tg-theme-hint-color)]">{filteredMovies.length} found</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} type="card" />)}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredMovies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 opacity-50">
            <Film className="w-12 h-12 mx-auto mb-4" />
            <p>No movies found</p>
          </div>
        )}
      </div>
    </div>
  );
}
