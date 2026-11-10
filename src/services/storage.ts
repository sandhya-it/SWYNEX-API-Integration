import { BookProgress, BookReview, ReadingStatus } from '../types/book';

const PROGRESS_STORAGE_KEY = 'bookverse_reading_progress';
const REVIEWS_STORAGE_KEY = 'bookverse_book_reviews';

// Initial sample community reviews for popular classics so readers see rich content immediately
const INITIAL_SAMPLE_REVIEWS: Record<string, BookReview[]> = {
  '/works/OL45804W': [
    {
      id: 'rev-pride-1',
      bookId: '/works/OL45804W',
      rating: 5,
      userName: 'Clara M.',
      reviewText: 'Jane Austen’s wit remains unmatched over two centuries later. Elizabeth and Darcy’s dialogue sparkles on every page.',
      createdAt: '2026-10-14T10:30:00.000Z',
    },
    {
      id: 'rev-pride-2',
      bookId: '/works/OL45804W',
      rating: 5,
      userName: 'Julian K.',
      reviewText: 'A masterclass in social commentary and character growth. A timeless masterpiece of English literature.',
      createdAt: '2026-11-01T15:20:00.000Z',
    },
  ],
  '/works/OL1168007W': [
    {
      id: 'rev-1984-1',
      bookId: '/works/OL1168007W',
      rating: 5,
      userName: 'David R.',
      reviewText: 'Chillingly prophetic and deeply thought-provoking. George Orwell creates an unforgettable portrait of surveillance and psychological control.',
      createdAt: '2026-09-28T09:12:00.000Z',
    },
  ],
  '/works/OL14933414W': [
    {
      id: 'rev-dune-1',
      bookId: '/works/OL14933414W',
      rating: 5,
      userName: 'Aria V.',
      reviewText: 'The depth of worldbuilding, ecology, and political intrigue in Frank Herbert’s Arrakis is peerless.',
      createdAt: '2026-10-22T18:45:00.000Z',
    },
  ],
};

export function loadReadingProgress(): Record<string, BookProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error loading reading progress from localStorage', e);
    return {};
  }
}

export function saveReadingProgress(progressMap: Record<string, BookProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressMap));
  } catch (e) {
    console.error('Error saving reading progress to localStorage', e);
  }
}

export function loadBookReviews(): Record<string, BookReview[]> {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_REVIEWS;
  try {
    const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
    if (!raw) {
      // Seed with initial reviews
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_REVIEWS));
      return INITIAL_SAMPLE_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reviews from localStorage', e);
    return INITIAL_SAMPLE_REVIEWS;
  }
}

export function saveBookReviews(reviewsMap: Record<string, BookReview[]>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviewsMap));
  } catch (e) {
    console.error('Error saving reviews to localStorage', e);
  }
}

export function calculateAverageRating(reviews?: BookReview[]): { average: number; count: number } {
  if (!reviews || reviews.length === 0) {
    return { average: 0, count: 0 };
  }
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const average = Math.round((sum / reviews.length) * 10) / 10;
  return { average, count: reviews.length };
}

export function formatReviewDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return 'Recent';
  }
}

export function getStatusLabel(status: ReadingStatus): string {
  switch (status) {
    case 'currently_reading':
      return 'Currently Reading';
    case 'finished':
      return 'Finished';
    case 'want_to_read':
      return 'Want to Read';
  }
}
