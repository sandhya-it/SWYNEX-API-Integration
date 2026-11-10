export interface OpenLibraryDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  edition_count?: number;
  publisher?: string[];
  language?: string[];
  ratings_average?: number;
}

export interface OpenLibrarySearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryDoc[];
}

export interface Book {
  id: string; // usually book.key, e.g. "/works/OL45804W"
  key: string;
  title: string;
  author: string;
  authors: string[];
  firstPublishYear: number | null;
  coverId?: number;
  coverUrl: string | null;
  subjects: string[];
  editionCount: number;
  openLibraryUrl: string;
}

export type SortOption = 
  | 'relevance'
  | 'title_asc'
  | 'title_desc'
  | 'year_desc'
  | 'year_asc'
  | 'editions_desc';

export type EraFilter = 
  | 'all'
  | 'pre_1950'
  | '1950_1999'
  | '2000_2015'
  | 'post_2015';

export interface FilterState {
  category: string;
  era: EraFilter;
  hasCoverOnly: boolean;
  sortBy: SortOption;
}

export type ReadingStatus = 'want_to_read' | 'currently_reading' | 'finished';

export interface BookProgress {
  bookId: string;
  status: ReadingStatus;
  progressPercentage: number; // 0 - 100
  updatedAt: string;
}

export interface BookReview {
  id: string;
  bookId: string;
  rating: number; // 1 - 5
  reviewText: string;
  userName: string;
  createdAt: string;
}

