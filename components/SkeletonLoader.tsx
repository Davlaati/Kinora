'use client';

import React from 'react';

export const SkeletonLoader = ({ type }: { type: 'card' | 'full' | 'details' }) => {
  if (type === 'full') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[var(--tg-theme-bg-color)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--tg-theme-button-color)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium animate-pulse">Loading Kinora...</p>
        </div>
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="aspect-[2/3] rounded-xl bg-[var(--tg-theme-secondary-bg-color)] animate-pulse flex flex-col p-3 justify-end">
        <div className="h-4 w-3/4 bg-white/10 rounded mb-2" />
        <div className="h-3 w-1/2 bg-white/10 rounded" />
      </div>
    );
  }

  return (
    <div className="p-4 animate-pulse">
      <div className="h-64 rounded-2xl bg-[var(--tg-theme-secondary-bg-color)] mb-4" />
      <div className="h-8 w-1/2 bg-[var(--tg-theme-secondary-bg-color)] rounded mb-2" />
      <div className="h-4 w-full bg-[var(--tg-theme-secondary-bg-color)] rounded mb-1" />
      <div className="h-4 w-3/4 bg-[var(--tg-theme-secondary-bg-color)] rounded" />
    </div>
  );
};
