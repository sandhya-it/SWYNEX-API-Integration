import React, { useState } from 'react';
import { Bookmark, Trash2, ArrowLeft, Download, Check, Sparkles, Clock, CheckCircle2, BookOpen } from 'lucide-react';
import { Book, BookProgress, BookReview, ReadingStatus } from '../types/book';
import { BookCard } from './BookCard';

interface FavoritesViewProps {
  favorites: Book[];
  onSelectBook: (book: Book) => void;
  onToggleFavorite: (book: Book) => void;
  onClearFavorites: () => void;
  onBackToExplore: () => void;
  readingProgress: Record<string, BookProgress>;
  reviews: Record<string, BookReview[]>;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  onSelectBook,
  onToggleFavorite,
  onClearFavorites,
  onBackToExplore,
  readingProgress,
  reviews,
}) => {
  const [copied, setCopied] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | ReadingStatus>('all');

  // Count by status
  const currentlyReadingCount = favorites.filter((b) => readingProgress[b.id]?.status === 'currently_reading').length;
  const finishedCount = favorites.filter((b) => readingProgress[b.id]?.status === 'finished').length;
  const wantToReadCount = favorites.filter((b) => readingProgress[b.id]?.status === 'want_to_read').length;

  const filteredFavorites = favorites.filter((book) => {
    if (statusFilter === 'all') return true;
    return readingProgress[book.id]?.status === statusFilter;
  });

  const handleExportReadingList = () => {
    if (favorites.length === 0) return;
    const content = `# My BOOKVERSE Reading Shelf\n\n` +
      favorites.map((b, i) => {
        const prog = readingProgress[b.id];
        const statusText = prog 
          ? prog.status === 'currently_reading' ? `Currently Reading (${prog.progressPercentage}%)`
          : prog.status === 'finished' ? 'Finished'
          : 'Want to Read'
          : 'Saved on Wishlist';
        return `${i + 1}. **${b.title}** by ${b.author} (${b.firstPublishYear || 'n.d.'})\n   - Status: ${statusText}\n   - Open Library: ${b.openLibraryUrl}`;
      }).join('\n\n');
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookverse-reading-shelf-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200/80 dark:border-slate-800">
        <div>
          <button
            onClick={onBackToExplore}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Catalog</span>
          </button>
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
              Personal Reading Shelf
            </h2>
            <span className="tabular-nums text-xs px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
              {favorites.length} {favorites.length === 1 ? 'saved book' : 'saved books'}
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track reading progress, update completion percentages, and view your personal book reviews.
          </p>
        </div>

        {favorites.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportReadingList}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-stone-200 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Download className="w-3.5 h-3.5" />}
              <span>{copied ? 'Downloaded' : 'Export Shelf (.md)'}</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to remove all saved books from your shelf?')) {
                  onClearFavorites();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Shelf</span>
            </button>
          </div>
        )}
      </div>

      {/* Reading Progress Quick Metric Badges */}
      {favorites.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setStatusFilter('all')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              statusFilter === 'all'
                ? 'bg-indigo-50/70 dark:bg-slate-800 border-indigo-300 dark:border-indigo-600'
                : 'bg-white dark:bg-slate-900 border-stone-200/80 dark:border-slate-800 hover:border-stone-300'
            }`}
          >
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">All Saved</div>
            <div className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">
              {favorites.length}
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('currently_reading')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              statusFilter === 'currently_reading'
                ? 'bg-indigo-50/70 dark:bg-slate-800 border-indigo-300 dark:border-indigo-600'
                : 'bg-white dark:bg-slate-900 border-stone-200/80 dark:border-slate-800 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Reading</span>
            </div>
            <div className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">
              {currentlyReadingCount}
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('want_to_read')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              statusFilter === 'want_to_read'
                ? 'bg-indigo-50/70 dark:bg-slate-800 border-indigo-300 dark:border-indigo-600'
                : 'bg-white dark:bg-slate-900 border-stone-200/80 dark:border-slate-800 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Want to Read</span>
            </div>
            <div className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">
              {wantToReadCount}
            </div>
          </button>

          <button
            onClick={() => setStatusFilter('finished')}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              statusFilter === 'finished'
                ? 'bg-indigo-50/70 dark:bg-slate-800 border-indigo-300 dark:border-indigo-600'
                : 'bg-white dark:bg-slate-900 border-stone-200/80 dark:border-slate-800 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Finished</span>
            </div>
            <div className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5 tabular-nums">
              {finishedCount}
            </div>
          </button>
        </div>
      )}

      {/* Grid or Empty */}
      {favorites.length === 0 ? (
        <div className="text-center py-20 px-4 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto shadow-sm">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-slate-100">
              Your reading shelf is empty
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Click the heart icon on any book card or use the details modal to track reading progress.
            </p>
          </div>
          <button
            onClick={onBackToExplore}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Discover Books</span>
          </button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="text-center py-12 px-4 max-w-sm mx-auto space-y-3">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No books found under the selected status filter.
          </p>
          <button
            onClick={() => setStatusFilter('all')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            Show All Saved Books
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFavorites.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={onSelectBook}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              progress={readingProgress[book.id]}
              reviews={reviews[book.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};
