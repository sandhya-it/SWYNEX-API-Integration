import { Book, OpenLibraryDoc, OpenLibrarySearchResponse } from '../types/book';

const BASE_URL = 'https://openlibrary.org/search.json';
const REQUEST_TIMEOUT_MS = 12000;

/**
 * Normalizes OpenLibrary document into our clean internal Book model
 */
export function mapDocToBook(doc: OpenLibraryDoc): Book {
  const authors = doc.author_name && doc.author_name.length > 0 
    ? doc.author_name 
    : ['Unknown Author'];

  const author = authors.slice(0, 2).join(', ') + (authors.length > 2 ? ' et al.' : '');
  const coverUrl = doc.cover_i 
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` 
    : null;

  return {
    id: doc.key,
    key: doc.key,
    title: doc.title || 'Untitled Work',
    author,
    authors,
    firstPublishYear: doc.first_publish_year || null,
    coverId: doc.cover_i,
    coverUrl,
    subjects: Array.isArray(doc.subject) ? doc.subject.slice(0, 8) : [],
    editionCount: doc.edition_count || 1,
    openLibraryUrl: `https://openlibrary.org${doc.key.startsWith('/') ? doc.key : `/${doc.key}`}`,
  };
}

export interface FetchBooksParams {
  query: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}

export interface FetchBooksResult {
  books: Book[];
  totalResults: number;
  page: number;
  hasMore: boolean;
}

/**
 * Searches Open Library books with resilient timeout and error handling
 */
export async function searchOpenLibraryBooks({
  query,
  page = 1,
  limit = 24,
  signal,
}: FetchBooksParams): Promise<FetchBooksResult> {
  const cleanQuery = query.trim() || 'fiction';
  
  const params = new URLSearchParams({
    q: cleanQuery,
    fields: 'key,title,author_name,first_publish_year,cover_i,subject,edition_count',
    limit: limit.toString(),
    page: page.toString(),
  });

  const url = `${BASE_URL}?${params.toString()}`;

  // Internal timeout controller linked to external signal
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => {
    timeoutController.abort(new Error('Request timed out'));
  }, REQUEST_TIMEOUT_MS);

  // Combine external signal with timeout
  const combinedSignal = signal;
  if (signal) {
    signal.addEventListener('abort', () => timeoutController.abort());
  }

  try {
    const response = await fetch(url, {
      signal: combinedSignal || timeoutController.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Open Library API responded with status ${response.status}`);
    }

    const data: OpenLibrarySearchResponse = await response.json();

    if (!data || !Array.isArray(data.docs)) {
      throw new Error('Received an unexpected data format from Open Library');
    }

    const books = data.docs.map(mapDocToBook);
    const totalResults = data.numFound || books.length;
    const hasMore = page * limit < totalResults && books.length > 0;

    return {
      books,
      totalResults,
      page,
      hasMore,
    };
  } catch (error: any) {
    clearTimeout(timeoutId);

    // If caller aborted intentionally (e.g. user typed a new query), rethrow so caller handles cleanly
    if (error.name === 'AbortError') {
      throw error;
    }

    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your network and try again.');
    }

    throw new Error(error.message || 'Unable to connect to Open Library. Please try again.');
  }
}

/**
 * Curated fallback books for offline or sandbox fallback when network is unavailable
 */
export const CURATED_FALLBACK_BOOKS: Book[] = [
  {
    id: '/works/OL45804W',
    key: '/works/OL45804W',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    authors: ['Jane Austen'],
    firstPublishYear: 1813,
    coverId: 8225261,
    coverUrl: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
    subjects: ['Classic Literature', 'Romance', 'British Fiction', '19th Century'],
    editionCount: 520,
    openLibraryUrl: 'https://openlibrary.org/works/OL45804W',
  },
  {
    id: '/works/OL27448W',
    key: '/works/OL27448W',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    authors: ['F. Scott Fitzgerald'],
    firstPublishYear: 1925,
    coverId: 8431940,
    coverUrl: 'https://covers.openlibrary.org/b/id/8431940-L.jpg',
    subjects: ['American Fiction', 'Jazz Age', 'Tragedy', 'Wealth'],
    editionCount: 380,
    openLibraryUrl: 'https://openlibrary.org/works/OL27448W',
  },
  {
    id: '/works/OL1168083W',
    key: '/works/OL1168083W',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    authors: ['Harper Lee'],
    firstPublishYear: 1960,
    coverId: 8226191,
    coverUrl: 'https://covers.openlibrary.org/b/id/8226191-L.jpg',
    subjects: ['Justice', 'American South', 'Coming of Age', 'Courtroom Fiction'],
    editionCount: 290,
    openLibraryUrl: 'https://openlibrary.org/works/OL1168083W',
  },
  {
    id: '/works/OL1168007W',
    key: '/works/OL1168007W',
    title: '1984',
    author: 'George Orwell',
    authors: ['George Orwell'],
    firstPublishYear: 1949,
    coverId: 7222246,
    coverUrl: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    subjects: ['Dystopia', 'Totalitarianism', 'Political Fiction', 'Surveillance'],
    editionCount: 460,
    openLibraryUrl: 'https://openlibrary.org/works/OL1168007W',
  },
  {
    id: '/works/OL14933414W',
    key: '/works/OL14933414W',
    title: 'Dune',
    author: 'Frank Herbert',
    authors: ['Frank Herbert'],
    firstPublishYear: 1965,
    coverId: 8931168,
    coverUrl: 'https://covers.openlibrary.org/b/id/8931168-L.jpg',
    subjects: ['Science Fiction', 'Space Opera', 'Ecology', 'Desert Planet'],
    editionCount: 198,
    openLibraryUrl: 'https://openlibrary.org/works/OL14933414W',
  },
  {
    id: '/works/OL262758W',
    key: '/works/OL262758W',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    authors: ['J.R.R. Tolkien'],
    firstPublishYear: 1937,
    coverId: 8406786,
    coverUrl: 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
    subjects: ['High Fantasy', 'Middle Earth', 'Adventure', 'Mythology'],
    editionCount: 410,
    openLibraryUrl: 'https://openlibrary.org/works/OL262758W',
  },
  {
    id: '/works/OL66554W',
    key: '/works/OL66554W',
    title: 'Jane Eyre',
    author: 'Charlotte Brontë',
    authors: ['Charlotte Brontë'],
    firstPublishYear: 1847,
    coverId: 8231856,
    coverUrl: 'https://covers.openlibrary.org/b/id/8231856-L.jpg',
    subjects: ['Gothic Romance', 'Victorian Literature', 'Social Class'],
    editionCount: 395,
    openLibraryUrl: 'https://openlibrary.org/works/OL66554W',
  },
  {
    id: '/works/OL53229W',
    key: '/works/OL53229W',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    authors: ['Aldous Huxley'],
    firstPublishYear: 1932,
    coverId: 8780512,
    coverUrl: 'https://covers.openlibrary.org/b/id/8780512-L.jpg',
    subjects: ['Dystopia', 'Futurism', 'Genetic Engineering', 'Science Fiction'],
    editionCount: 275,
    openLibraryUrl: 'https://openlibrary.org/works/OL53229W',
  }
];
