import React, { useState } from 'react';
import { Book as BookIcon, Heart, ExternalLink, Star, CheckCircle2, Clock, Bookmark } from 'lucide-react';
import { Book, BookProgress, BookReview } from '../types/book';
import { calculateAverageRating } from '../services/storage';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  isFavorite: boolean;
  onToggleFavorite: (book: Book) => void;
  progress?: BookProgress;
  reviews?: BookReview[];
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onSelect,
  isFavorite,
  onToggleFavorite,
  progress,
  reviews = [],
}) => {
  const [imgError, setImgError] = useState(false);

  // Gradient generator for fallback covers based on book title length
  const fallbackGradients = [
    'from-amber-700 to-amber-950',
    'from-slate-700 to-slate-950',
    'from-indigo-800 to-indigo-950',
    'from-emerald-800 to-emerald-950',
    'from-rose-800 to-rose-950',
    'from-teal-800 to-teal-950',
  ];
  const gradientIndex = Math.abs(book.title.length) % fallbackGradients.length;
  const gradientClass = fallbackGradients[gradientIndex];

  const { average, count } = calculateAverageRating(reviews);

  return (
    <article className="group flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-stone-200/80 dark:border-slate-800 p-4 transition-all duration-200 hover:border-stone-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-stone-900/5 dark:hover:shadow-none">
      
      {/* Top Cover Visual */}
      <div className="relative w-full aspect-[2/3] mb-4 rounded-xl overflow-hidden bg-stone-100 dark:bg-slate-800 flex items-center justify-center">
        {book.coverUrl && !imgError ? (
          <img
            src={book.coverUrl}
            alt={`Cover of ${book.title}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102 cursor-pointer"
            onClick={() => onSelect(book)}
            loading="lazy"
          />
        ) : (
          /* Styled Fallback Cover */
          <div 
            onClick={() => onSelect(book)}
            className={`w-full h-full bg-gradient-to-br ${gradientClass} p-4 flex flex-col justify-between text-white relative book-spine-effect cursor-pointer`}
          >
            <div className="flex justify-between items-start">
              <span className="text-[10px] tracking-wider uppercase font-mono text-white/70">
                Open Library Edition
              </span>
              <BookIcon className="w-4 h-4 text-white/50" />
            </div>

            <div className="my-auto py-2">
              <p className="font-serif text-base font-bold line-clamp-3 leading-snug tracking-tight text-white/95">
                {book.title}
              </p>
              <p className="text-xs text-white/80 mt-1 line-clamp-2">
                {book.author}
              </p>
            </div>

            <div className="text-[10px] text-white/60 font-mono">
              {book.firstPublishYear ? `Pub. ${book.firstPublishYear}` : 'Archived Title'}
            </div>
          </div>
        )}

        {/* Favorite Quick-Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(book);
          }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
            isFavorite
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white stroke-white' : ''}`} />
        </button>

        {/* Reading Status Pill Indicator on Cover */}
        {progress && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 pointer-events-none">
            {progress.status === 'currently_reading' && (
              <div className="bg-slate-950/85 backdrop-blur-md text-white px-2 py-1 rounded-md text-[11px] font-medium shadow-sm flex items-center justify-between">
                <span className="flex items-center gap-1 text-indigo-300">
                  <Clock className="w-3 h-3" />
                  <span>Reading</span>
                </span>
                <span className="font-mono tabular-nums text-white font-bold">
                  {progress.progressPercentage}%
                </span>
              </div>
            )}
            {progress.status === 'finished' && (
              <div className="bg-emerald-950/85 backdrop-blur-md text-emerald-200 px-2 py-1 rounded-md text-[11px] font-medium shadow-sm inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Finished</span>
              </div>
            )}
            {progress.status === 'want_to_read' && (
              <div className="bg-slate-950/85 backdrop-blur-md text-slate-200 px-2 py-1 rounded-md text-[11px] font-medium shadow-sm inline-flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-indigo-400" />
                <span>Want to Read</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Book Metadata & Title */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1.5 flex-wrap">
            <span>{book.firstPublishYear || 'N/A'}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">{book.editionCount} {book.editionCount === 1 ? 'ed.' : 'eds.'}</span>
            {count > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-amber-500 font-semibold tabular-nums">
                  <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                  <span>{average.toFixed(1)}</span>
                </span>
              </>
            )}
          </div>

          <h3 
            onClick={() => onSelect(book)}
            className="font-serif text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 cursor-pointer leading-snug mb-1"
            title={book.title}
          >
            {book.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-3">
            by {book.author}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => onSelect(book)}
            className="flex-1 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-slate-100 bg-stone-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white rounded-lg transition-colors text-center"
          >
            View Details
          </button>
          <a
            href={book.openLibraryUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Library Entry"
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </article>
  );
};
