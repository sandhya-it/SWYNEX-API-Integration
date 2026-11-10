import React, { useState } from 'react';
import { Search, Loader2, Sparkles, BookMarked } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  isLoading: boolean;
  onQuickCategory: (cat: string) => void;
}

const POPULAR_QUERIES = [
  'Science Fiction',
  'Classic Literature',
  'Mystery & Detective',
  'Philosophy',
  'World History',
  'Fantasy',
];

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearch,
  isLoading,
  onQuickCategory,
}) => {
  const [inputValue, setInputValue] = useState(searchQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        onSearch(inputValue.trim());
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-12 md:pb-20 bg-gradient-to-b from-stone-100/60 to-transparent dark:from-slate-900/40 dark:to-transparent border-b border-stone-200/60 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Subtitle & Search Bar */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-4 h-4" />
              <span>Open Library Catalog Explorer</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.12] text-balance">
              Discover Your Next Favourite Book
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Explore thousands of books, discover new authors, and find your next great read. Access millions of open publications instantly with rich edition details and cover art.
            </p>

            {/* Large Search Bar */}
            <form onSubmit={handleSubmit} className="pt-2">
              <div className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 bg-white dark:bg-slate-900 rounded-2xl shadow-lg shadow-stone-900/5 dark:shadow-none border border-stone-200/80 dark:border-slate-800 transition-all focus-within:ring-2 focus-within:ring-indigo-500/40 focus-within:border-indigo-500">
                <div className="relative flex-1 flex items-center pl-3">
                  <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0 mr-3" />
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search by book title, author, or keyword (e.g. Orwell, Dune)..."
                    disabled={isLoading}
                    className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none disabled:opacity-60"
                  />
                  {inputValue && (
                    <button
                      type="button"
                      onClick={() => {
                        setInputValue('');
                        onSearch('fiction');
                      }}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 px-2 py-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search Books</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Discover Badges (Functional Buttons) */}
            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2.5">
                <BookMarked className="w-3.5 h-3.5" />
                <span>Trending subjects:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_QUERIES.map((query) => (
                  <button
                    key={query}
                    onClick={() => {
                      setInputValue(query);
                      onQuickCategory(query);
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-stone-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg border border-stone-200/70 dark:border-slate-700/60 transition-colors whitespace-nowrap"
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-stone-200/80 dark:border-slate-800 shadow-2xl shadow-indigo-950/10">
              <img
                src="/src/assets/images/bookverse_hero_library_1794304857218.jpg"
                alt="Architectural grand library with bookshelves and natural sunlight"
                className="w-full h-80 sm:h-96 lg:h-[440px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

              {/* Editorial Caption Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/20 dark:border-slate-800 shadow-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100">
                      The Open Knowledge Commons
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Direct, open access to over 20+ million public records worldwide.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 shrink-0">
                    Free & Open
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
