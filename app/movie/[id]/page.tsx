'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useTMA } from '@/components/TMAProvider';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import WebApp from '@twa-dev/sdk';
import { Star, Play, Lock, Info, Calendar, Clock } from 'lucide-react';
import { motion } from 'motion/react';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useTMA();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      const docRef = doc(db, 'movies', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMovie(data);
        
        // Check if locked
        if (data.is_premium && !user?.is_premium) {
          setIsLocked(true);
        }
      }
      setLoading(false);
    };

    fetchMovie();
  }, [id, user]);

  useEffect(() => {
    // Show BackButton
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(() => {
      router.back();
    });

    return () => {
      WebApp.BackButton.hide();
      WebApp.MainButton.hide();
    };
  }, [router]);

  useEffect(() => {
    if (isLocked) {
      WebApp.MainButton.setText('BUY PREMIUM');
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(() => {
        WebApp.showAlert('Premium subscription coming soon via Telegram Payments!');
      });
    } else {
      WebApp.MainButton.hide();
    }
  }, [isLocked]);

  if (loading) return <SkeletonLoader type="details" />;
  if (!movie) return <div className="p-20 text-center">Movie not found</div>;

  return (
    <div className="pb-20">
      {/* Video Player / Poster */}
      <div className="relative aspect-video bg-black overflow-hidden">
        {isLocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6 text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Premium Content</h2>
            <p className="text-white/60 text-sm mb-6">This movie is exclusive to Kinora Premium members. Upgrade your account to watch.</p>
          </div>
        ) : (
          <video 
            src={movie.video_url} 
            poster={movie.poster_url}
            controls
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Movie Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">{movie.title}</h1>
            <div className="flex items-center gap-3 text-xs text-[var(--tg-theme-hint-color)]">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {movie.release_year}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {movie.duration || 'N/A'}</span>
              <span className="px-2 py-0.5 bg-[var(--tg-theme-secondary-bg-color)] rounded">{movie.genre}</span>
            </div>
          </div>
          {movie.is_premium && (
            <div className="bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> PREMIUM
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
            <Info className="w-4 h-4 text-[var(--tg-theme-button-color)]" />
            Synopsis
          </h3>
          <p className="text-sm text-[var(--tg-theme-text-color)] opacity-80 leading-relaxed">
            {movie.description}
          </p>
        </div>

        {/* Cast / More Info (Placeholder) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded-xl">
            <span className="text-[10px] text-[var(--tg-theme-hint-color)] block mb-1">Director</span>
            <span className="text-sm font-medium">Christopher Nolan</span>
          </div>
          <div className="p-3 bg-[var(--tg-theme-secondary-bg-color)] rounded-xl">
            <span className="text-[10px] text-[var(--tg-theme-hint-color)] block mb-1">Rating</span>
            <span className="text-sm font-medium flex items-center gap-1">8.8/10 <Star className="w-3 h-3 text-amber-500 fill-current" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
