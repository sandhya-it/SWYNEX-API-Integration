import React from 'react';
import { BookOpen, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-stone-200/80 dark:border-slate-800 bg-[#f4f2ee]/60 dark:bg-[#080b10] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
                BOOKVERSE
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              Discover your next read through the open literature catalog. Search, filter, and curate literary favorites.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <a
              href="https://openlibrary.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span>Powered by Open Library</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://archive.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span>Internet Archive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://openlibrary.org/developers/api"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <span>API Documentation</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-stone-200/60 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>for book lovers and lifelong learners</span>
          </p>
          <p>
            © {new Date().getFullYear()} BOOKVERSE. All book data & cover images courtesy of Open Library.
          </p>
        </div>

      </div>
    </footer>
  );
};
