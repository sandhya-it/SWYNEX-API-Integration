import React from 'react';

export const BookSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/80 dark:border-slate-800 p-4 space-y-4 animate-pulse"
        >
          {/* Cover Skeleton */}
          <div className="w-full aspect-[2/3] rounded-xl bg-stone-200 dark:bg-slate-800" />
          
          {/* Metadata Skeleton */}
          <div className="space-y-2">
            <div className="h-3 w-1/3 bg-stone-200 dark:bg-slate-800 rounded" />
            <div className="h-5 w-4/5 bg-stone-200 dark:bg-slate-800 rounded" />
            <div className="h-4 w-1/2 bg-stone-200 dark:bg-slate-800 rounded" />
          </div>

          {/* Button Skeleton */}
          <div className="pt-2 border-t border-stone-100 dark:border-slate-800/80">
            <div className="h-8 w-full bg-stone-200 dark:bg-slate-800 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
};
