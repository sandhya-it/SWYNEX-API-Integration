import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Heart, Calendar, Layers, Share2, Check, Star, BookOpen, Clock, CheckCircle2, MessageSquare, Trash2, Send } from 'lucide-react';
import { Book, BookProgress, BookReview, ReadingStatus } from '../types/book';
import { calculateAverageRating, formatReviewDate } from '../services/storage';

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (book: Book) => void;
  progress?: BookProgress;
  onUpdateProgress: (bookId: string, status: ReadingStatus | null, percentage?: number) => void;
  reviews?: BookReview[];
  onAddReview: (bookId: string, rating: number, reviewText: string, userName: string) => void;
  onDeleteReview: (bookId: string, reviewId: string) => void;
}

export const BookModal: React.FC<BookModalProps> = ({
  book,
  onClose,
  isFavorite,
  onToggleFavorite,
  progress,
  onUpdateProgress,
  reviews = [],
  onAddReview,
  onDeleteReview,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Review form states
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewText, setReviewText] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Progress percentage local state for smooth sliding
  const [localPercentage, setLocalPercentage] = useState<number>(progress?.progressPercentage || 0);

  useEffect(() => {
    if (progress) {
      setLocalPercentage(progress.progressPercentage);
    } else {
      setLocalPercentage(0);
    }
  }, [progress]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (book) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [book, onClose]);

  if (!book) return null;

  const currentStatus = progress?.status || null;
  const { average, count } = calculateAverageRating(reviews);

  const handleCopyCitation = () => {
    const citation = `"${book.title}" by ${book.author} (${book.firstPublishYear || 'n.d.'}). Open Library: ${book.openLibraryUrl}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleStatusChange = (status: ReadingStatus | null) => {
    if (status === 'currently_reading') {
      onUpdateProgress(book.id, status, localPercentage || 10);
    } else if (status === 'finished') {
      setLocalPercentage(100);
      onUpdateProgress(book.id, status, 100);
    } else if (status === 'want_to_read') {
      setLocalPercentage(0);
      onUpdateProgress(book.id, status, 0);
    } else {
      onUpdateProgress(book.id, null);
    }
  };

  const handlePercentageChange = (val: number) => {
    setLocalPercentage(val);
    if (val >= 100) {
      onUpdateProgress(book.id, 'finished', 100);
    } else {
      onUpdateProgress(book.id, 'currently_reading', val);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    onAddReview(
      book.id,
      newRating,
      reviewText.trim(),
      reviewerName.trim() || 'Reader'
    );

    setReviewText('');
    setReviewerName('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-book-title"
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl border border-stone-200/80 dark:border-slate-800 shadow-2xl z-10 p-5 sm:p-8 transition-colors"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Book Cover & Actions */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-48 sm:w-56 md:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-stone-200/80 dark:border-slate-800 bg-stone-100 dark:bg-slate-800">
              {book.coverUrl && !imgError ? (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-950 p-6 flex flex-col justify-between text-white book-spine-effect">
                  <div>
                    <span className="text-[11px] font-mono tracking-wider uppercase text-white/60">
                      Open Library Edition
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-bold leading-snug">{book.title}</h4>
                    <p className="text-xs text-white/75 mt-1">{book.author}</p>
                  </div>
                  <div className="text-xs text-white/50 font-mono">
                    {book.firstPublishYear ? `Year ${book.firstPublishYear}` : 'Public Domain'}
                  </div>
                </div>
              )}
            </div>

            {/* Favorite & Citation Action buttons */}
            <div className="w-full max-w-xs mt-4 flex gap-2">
              <button
                onClick={() => onToggleFavorite(book)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                  isFavorite
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-stone-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-700 dark:text-slate-300 hover:text-rose-500 border border-stone-200/80 dark:border-slate-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white stroke-white' : ''}`} />
                <span>{isFavorite ? 'Saved to Shelf' : 'Add to Shelf'}</span>
              </button>

              <button
                onClick={handleCopyCitation}
                title="Copy citation to clipboard"
                className="p-2 rounded-xl border border-stone-200/80 dark:border-slate-700 bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
            {copied && (
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">
                Citation copied to clipboard!
              </span>
            )}

            {/* Direct Open Library link */}
            <div className="w-full max-w-xs mt-3">
              <a
                href={book.openLibraryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 hover:bg-stone-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                <span>Open Library Canonical Record</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Details, Progress Tracker, and Reviews */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Title & Author */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                <span>Book Details</span>
                {count > 0 && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      <span>{average.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({count})</span>
                    </span>
                  </>
                )}
              </div>
              <h2 id="modal-book-title" className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {book.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Written by <span className="font-semibold text-slate-800 dark:text-slate-200">{book.authors.join(', ')}</span>
              </p>
            </div>

            {/* Quick Stat Strip */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/70 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">First Published</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {book.firstPublishYear ? book.firstPublishYear : 'Archived'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Editions</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {book.editionCount}
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* FEATURE 1: READING PROGRESS TRACKING (localStorage) */}
            {/* ======================================================== */}
            <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/80 border border-indigo-100 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Reading Status</span>
                </span>
                {currentStatus && (
                  <button
                    onClick={() => handleStatusChange(null)}
                    className="text-[11px] text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    Clear Status
                  </button>
                )}
              </div>

              {/* Status Segmented Buttons */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-stone-100 dark:bg-slate-900 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleStatusChange('want_to_read')}
                  className={`py-2 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    currentStatus === 'want_to_read'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span className="truncate">Want to Read</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('currently_reading')}
                  className={`py-2 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    currentStatus === 'currently_reading'
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span className="truncate">Reading</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('finished')}
                  className={`py-2 px-2 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                    currentStatus === 'finished'
                      ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="truncate">Finished</span>
                </button>
              </div>

              {/* Progress Slider (Only visible when currently reading or updating) */}
              {currentStatus === 'currently_reading' && (
                <div className="pt-2 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      Progress Completion
                    </span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                      {localPercentage}%
                    </span>
                  </div>

                  {/* Progress Bar Track */}
                  <div className="w-full bg-stone-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-200"
                      style={{ width: `${localPercentage}%` }}
                    />
                  </div>

                  {/* Slider Control */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={localPercentage}
                    onChange={(e) => handlePercentageChange(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-1.5 bg-stone-200 dark:bg-slate-700 rounded-lg appearance-none"
                  />

                  {/* Quick percentage milestone shortcuts */}
                  <div className="flex items-center justify-between gap-1 pt-1">
                    {[25, 50, 75, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handlePercentageChange(preset)}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded transition-colors ${
                          localPercentage === preset
                            ? 'bg-indigo-600 text-white'
                            : 'bg-stone-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-stone-300'
                        }`}
                      >
                        {preset === 100 ? '100% (Done)' : `${preset}%`}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {currentStatus === 'finished' && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium pt-1">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>You finished reading this book! Great achievement.</span>
                </div>
              )}
            </div>

            {/* Subjects / Categories */}
            {book.subjects && book.subjects.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Subjects & Themes
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {book.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs rounded-md bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-stone-200/70 dark:border-slate-700"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ======================================================== */}
            {/* FEATURE 2: USER REVIEWS & RATING SYSTEM (localStorage) */}
            {/* ======================================================== */}
            <div className="border-t border-stone-200/80 dark:border-slate-800 pt-6 space-y-4">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Reader Reviews & Ratings</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Share your thoughts and rate this book for other book lovers.
                  </p>
                </div>

                {count > 0 && (
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-base">
                      <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                      <span>{average.toFixed(1)}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{count} {count === 1 ? 'review' : 'reviews'}</span>
                  </div>
                )}
              </div>

              {/* Write Review Form */}
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/70 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 mr-2">Your Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating || newRating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star className={`w-5 h-5 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                              : 'stroke-stone-300 dark:stroke-slate-600 text-transparent'
                          }`} />
                        </button>
                      );
                    })}
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1.5">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Masterpiece'][hoverRating || newRating]}
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="Your Name (Optional)"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="text-xs bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:w-44"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="What did you think of this book? Mention the writing style, plot, characters..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />

                <div className="flex items-center justify-between pt-1">
                  {reviewSubmitted ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Thank you! Your review has been saved.</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Reviews are saved locally to your device.
                    </span>
                  )}

                  <button
                    type="submit"
                    disabled={!reviewText.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Review</span>
                  </button>
                </div>
              </form>

              {/* Existing Reviews List */}
              <div className="space-y-3 pt-2">
                {reviews.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    No reviews yet. Be the first reader to review this book!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-stone-200/80 dark:border-slate-700 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {rev.userName}
                          </span>
                          <span className="text-slate-400 text-[11px]">·</span>
                          <span className="text-[11px] text-slate-400">
                            {formatReviewDate(rev.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Rating Stars */}
                          <div className="flex items-center text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? 'fill-amber-400 stroke-amber-400'
                                    : 'stroke-stone-300 dark:stroke-slate-600 text-transparent'
                                }`}
                              />
                            ))}
                          </div>

                          {/* Delete review button */}
                          <button
                            type="button"
                            onClick={() => onDeleteReview(book.id, rev.id)}
                            title="Delete this review"
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.reviewText}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
