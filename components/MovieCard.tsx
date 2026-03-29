'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Play } from 'lucide-react';
import { motion } from 'motion/react';

export const MovieCard = ({ movie }: { movie: any }) => {
  return (
    <Link href={`/movie/${movie.id}`}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[var(--tg-theme-secondary-bg-color)] group"
      >
        <img 
          src={movie.poster_url} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {movie.is_premium && (
            <div className="bg-amber-500 text-white p-1 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" />
            </div>
          )}
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3 className="text-white text-sm font-bold line-clamp-1 mb-0.5">{movie.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-[10px]">{movie.genre}</span>
            <span className="text-white/60 text-[10px]">{movie.release_year}</span>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
            <Play className="w-5 h-5 text-white fill-current" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};
