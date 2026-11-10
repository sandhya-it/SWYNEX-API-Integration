import React from 'react';
import { BookOpen, Bookmark, Moon, Sun } from 'lucide-react';

interface NavbarProps {
  favoritesCount: number;
  activeTab: 'explore' | 'favorites' | 'about';
  setActiveTab: (tab: 'explore' | 'favorites' | 'about') => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onExploreClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  favoritesCount,
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode,
  onExploreClick,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#fbfaf8]/90 dark:bg-[#0c1017]/90 backdrop-blur-md border-b border-stone-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => {
            setActiveTab('explore');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 text-left group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm group-hover:bg-indigo-700 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            BOOKVERSE
          </span>
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => {
              setActiveTab('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'explore'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Home
          </button>
          <button
            onClick={onExploreClick}
            className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors whitespace-nowrap"
          >
            Explore Books
          </button>
          <button
            onClick={() => {
              setActiveTab('favorites');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <span>Reading Shelf</span>
            {favoritesCount > 0 && (
              <span className="tabular-nums text-xs px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium">
                {favoritesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('about');
              const el = document.getElementById('about-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`transition-colors whitespace-nowrap ${
              activeTab === 'about'
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 primary action cluster (Favorites + Dark mode toggle) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab(activeTab === 'favorites' ? 'explore' : 'favorites')}
            className={`flex md:hidden items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              activeTab === 'favorites'
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'border-stone-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
            }`}
            aria-label="View saved favorites"
          >
            <Bookmark className="w-4 h-4" />
            <span className="tabular-nums font-semibold">{favoritesCount}</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-lg border border-stone-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onExploreClick}
            className="hidden sm:inline-flex px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            Browse Library
          </button>
        </div>
      </div>
    </header>
  );
};
