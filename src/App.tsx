/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FilterBar } from './components/FilterBar';
import { BookCard } from './components/BookCard';
import { BookModal } from './components/BookModal';
import { BookSkeleton } from './components/BookSkeleton';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { FavoritesView } from './components/FavoritesView';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { Book, FilterState, BookProgress, BookReview, ReadingStatus } from './types/book';
import { searchOpenLibraryBooks, CURATED_FALLBACK_BOOKS } from './services/openLibrary';
import { loadReadingProgress, saveReadingProgress, loadBookReviews, saveBookReviews } from './services/storage';
import { ChevronDown, Sparkles, BookOpen } from 'lucide-react';

const INITIAL_FILTER_STATE: FilterState = {
  category: 'all',
  era: 'all',
  hasCoverOnly: false,
  sortBy: 'relevance',
};

const DEFAULT_CATEGORIES = [
  'Fiction',
  'Science',
  'Fantasy',
  'History',
  'Mystery',
  'Philosophy',
  'Biography',
  'Romance',
];

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bookverse_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'explore' | 'favorites' | 'about'>('explore');

  // Book fetching & pagination state
  const [searchQuery, setSearchQuery] = useState<string>('fiction');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [totalResults, setTotalResults] = useState<number>(0);

  // Filters state
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER_STATE);

  // Selected book for details modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState<Book[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bookverse_favorites');
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error('Failed to load favorites from localStorage', e);
        return [];
      }
    }
    return [];
  });

  // Reading progress state persisted in localStorage
  const [readingProgress, setReadingProgress] = useState<Record<string, BookProgress>>(() => {
    return loadReadingProgress();
  });

  // Book user reviews state persisted in localStorage
  const [reviews, setReviews] = useState<Record<string, BookReview[]>>(() => {
    return loadBookReviews();
  });

  // Track active fetch controller for aborting obsolete requests
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync theme with document class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bookverse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bookverse_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bookverse_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Sync reading progress with localStorage
  useEffect(() => {
    saveReadingProgress(readingProgress);
  }, [readingProgress]);

  // Sync reviews with localStorage
  useEffect(() => {
    saveBookReviews(reviews);
  }, [reviews]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Toggle favorite helper
  const handleToggleFavorite = useCallback((book: Book) => {
    setFavorites((prev) => {
      const exists = prev.some((b) => b.id === book.id);
      if (exists) {
        return prev.filter((b) => b.id !== book.id);
      } else {
        return [book, ...prev];
      }
    });
  }, []);

  // Update reading progress handler
  const handleUpdateProgress = useCallback((bookId: string, status: ReadingStatus | null, percentage: number = 0) => {
    setReadingProgress((prev) => {
      const next = { ...prev };
      if (!status) {
        delete next[bookId];
      } else {
        next[bookId] = {
          bookId,
          status,
          progressPercentage: status === 'finished' ? 100 : Math.min(100, Math.max(0, percentage)),
          updatedAt: new Date().toISOString(),
        };
      }
      return next;
    });

    // If status is assigned and book is in current view but not yet in favorites, add to favorites shelf
    if (status && selectedBook && selectedBook.id === bookId) {
      setFavorites((prev) => {
        if (!prev.some((b) => b.id === bookId)) {
          return [selectedBook, ...prev];
        }
        return prev;
      });
    }
  }, [selectedBook]);

  // Add review handler
  const handleAddReview = useCallback((bookId: string, rating: number, reviewText: string, userName: string) => {
    const newRev: BookReview = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      bookId,
      rating,
      reviewText,
      userName: userName.trim() || 'Reader',
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => {
      const currentList = prev[bookId] || [];
      return {
        ...prev,
        [bookId]: [newRev, ...currentList],
      };
    });
  }, []);

  // Delete review handler
  const handleDeleteReview = useCallback((bookId: string, reviewId: string) => {
    setReviews((prev) => {
      const currentList = prev[bookId] || [];
      return {
        ...prev,
        [bookId]: currentList.filter((r) => r.id !== reviewId),
      };
    });
  }, []);

  // Fetch books from Open Library
  const fetchBooks = useCallback(async (query: string, targetPage: number = 1, append: boolean = false) => {
    // Abort previous in-flight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
      setErrorMessage(null);
    }

    try {
      const result = await searchOpenLibraryBooks({
        query,
        page: targetPage,
        limit: 24,
        signal: controller.signal,
      });

      if (append) {
        setBooks((prev) => {
          const existingIds = new Set(prev.map((b) => b.id));
          const newUnique = result.books.filter((b) => !existingIds.has(b.id));
          return [...prev, ...newUnique];
        });
      } else {
        setBooks(result.books);
      }

      setTotalResults(result.totalResults);
      setHasMore(result.hasMore);
      setPage(targetPage);
      setErrorMessage(null);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Intentionally aborted due to newer query
        return;
      }
      console.warn('Open Library fetch error:', err);
      if (!append) {
        setErrorMessage(err.message || 'Failed to fetch book results.');
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBooks('fiction', 1, false);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchBooks]);

  // Handle new search submit
  const handleSearch = (newQuery: string) => {
    setSearchQuery(newQuery);
    setFilterState(INITIAL_FILTER_STATE);
    setActiveTab('explore');
    fetchBooks(newQuery, 1, false);
  };

  // Quick category trigger
  const handleQuickCategory = (cat: string) => {
    setSearchQuery(cat);
    setFilterState(INITIAL_FILTER_STATE);
    setActiveTab('explore');
    fetchBooks(cat, 1, false);
  };

  // Load more pages
  const handleLoadMore = () => {
    if (!isLoading && !isLoadingMore && hasMore) {
      fetchBooks(searchQuery, page + 1, true);
    }
  };

  // Curated classics fallback trigger
  const handleLoadCurated = () => {
    setBooks(CURATED_FALLBACK_BOOKS);
    setTotalResults(CURATED_FALLBACK_BOOKS.length);
    setHasMore(false);
    setErrorMessage(null);
    setIsLoading(false);
  };

  // Filter and sort books client-side
  const filteredAndSortedBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Cover filter
        if (filterState.hasCoverOnly && !book.coverUrl) {
          return false;
        }

        // Category filter
        if (filterState.category !== 'all') {
          const catLower = filterState.category.toLowerCase();
          const matchesSubject = book.subjects.some((s) => s.toLowerCase().includes(catLower));
          const matchesTitle = book.title.toLowerCase().includes(catLower);
          if (!matchesSubject && !matchesTitle) {
            return false;
          }
        }

        // Era filter
        if (filterState.era !== 'all') {
          const year = book.firstPublishYear;
          if (!year) return false;
          if (filterState.era === 'pre_1950' && year >= 1950) return false;
          if (filterState.era === '1950_1999' && (year < 1950 || year > 1999)) return false;
          if (filterState.era === '2000_2015' && (year < 2000 || year > 2015)) return false;
          if (filterState.era === 'post_2015' && year <= 2015) return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (filterState.sortBy) {
          case 'title_asc':
            return a.title.localeCompare(b.title);
          case 'title_desc':
            return b.title.localeCompare(a.title);
          case 'year_desc':
            return (b.firstPublishYear || 0) - (a.firstPublishYear || 0);
          case 'year_asc':
            return (a.firstPublishYear || 9999) - (b.firstPublishYear || 9999);
          case 'editions_desc':
            return b.editionCount - a.editionCount;
          case 'relevance':
          default:
            return 0;
        }
      });
  }, [books, filterState]);

  // Dynamically extract available categories
  const availableCategories = useMemo(() => {
    const set = new Set<string>(DEFAULT_CATEGORIES);
    books.forEach((b) => {
      b.subjects.slice(0, 3).forEach((sub) => {
        if (sub.length < 20 && !sub.includes(':') && !sub.includes('//')) {
          set.add(sub);
        }
      });
    });
    return Array.from(set).slice(0, 10);
  }, [books]);

  const scrollToExplore = () => {
    setActiveTab('explore');
    const el = document.getElementById('books-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isFilterActive =
    filterState.category !== 'all' ||
    filterState.era !== 'all' ||
    filterState.hasCoverOnly ||
    filterState.sortBy !== 'relevance';

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8] dark:bg-[#0c1017] text-slate-900 dark:text-slate-100 transition-colors font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        favoritesCount={favorites.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onExploreClick={scrollToExplore}
      />

      <main className="flex-1">
        {activeTab === 'favorites' ? (
          /* Favorites & Reading Tracker View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <FavoritesView
              favorites={favorites}
              onSelectBook={setSelectedBook}
              onToggleFavorite={handleToggleFavorite}
              onClearFavorites={() => {
                setFavorites([]);
                setReadingProgress({});
              }}
              onBackToExplore={() => setActiveTab('explore')}
              readingProgress={readingProgress}
              reviews={reviews}
            />
          </div>
        ) : (
          /* Explore / Home View */
          <>
            {/* Hero Section */}
            <Hero
              searchQuery={searchQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
              onQuickCategory={handleQuickCategory}
            />

            {/* Featured Books Section */}
            <section id="books-section" className="py-12 md:py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                
                {/* Section Title Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 mb-1">
                      <BookOpen className="w-4 h-4" />
                      <span>Curated Catalog</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      {searchQuery ? `Results for "${searchQuery}"` : 'Featured Books'}
                    </h2>
                  </div>

                  {totalResults > 0 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {totalResults.toLocaleString()} entries catalogued in Open Library
                    </div>
                  )}
                </div>

                {/* Filter & Sort Controls */}
                <FilterBar
                  filterState={filterState}
                  onFilterChange={(updates) => setFilterState((prev) => ({ ...prev, ...updates }))}
                  onResetFilters={() => setFilterState(INITIAL_FILTER_STATE)}
                  totalFilteredCount={filteredAndSortedBooks.length}
                  totalFetchedCount={books.length}
                  availableCategories={availableCategories}
                />

                {/* Content States: Loading, Error, Empty, or Book Grid */}
                {isLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                      <span>Curating book records from Open Library...</span>
                    </div>
                    <BookSkeleton />
                  </div>
                ) : errorMessage ? (
                  <ErrorState
                    errorMessage={errorMessage}
                    onRetry={() => fetchBooks(searchQuery, 1, false)}
                    onLoadCurated={handleLoadCurated}
                  />
                ) : filteredAndSortedBooks.length === 0 ? (
                  <EmptyState
                    query={searchQuery}
                    onSelectSuggestion={handleSearch}
                    onResetFilters={() => setFilterState(INITIAL_FILTER_STATE)}
                    isFilterActive={isFilterActive}
                  />
                ) : (
                  <>
                    {/* Responsive Book Grid: 4-col desktop, 2-col tablet, 1-2 col mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {filteredAndSortedBooks.map((book) => (
                        <BookCard
                          key={book.id}
                          book={book}
                          onSelect={setSelectedBook}
                          isFavorite={favorites.some((f) => f.id === book.id)}
                          onToggleFavorite={handleToggleFavorite}
                          progress={readingProgress[book.id]}
                          reviews={reviews[book.id]}
                        />
                      ))}
                    </div>

                    {/* Pagination / Load More Button */}
                    {hasMore && (
                      <div className="pt-8 text-center">
                        <button
                          onClick={handleLoadMore}
                          disabled={isLoadingMore}
                          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-slate-900 border border-stone-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-800 dark:text-slate-200 shadow-sm hover:shadow transition-all disabled:opacity-60"
                        >
                          {isLoadingMore ? (
                            <>
                              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                              <span>Loading more books...</span>
                            </>
                          ) : (
                            <>
                              <span>Load More Books</span>
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}

              </div>
            </section>

            {/* About Section */}
            <AboutSection />
          </>
        )}
      </main>

      {/* Book Details Modal */}
      <BookModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        isFavorite={selectedBook ? favorites.some((f) => f.id === selectedBook.id) : false}
        onToggleFavorite={handleToggleFavorite}
        progress={selectedBook ? readingProgress[selectedBook.id] : undefined}
        onUpdateProgress={handleUpdateProgress}
        reviews={selectedBook ? reviews[selectedBook.id] : undefined}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
