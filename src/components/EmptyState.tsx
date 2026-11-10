import React from 'react';
import { SearchX, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  query: string;
  onSelectSuggestion: (query: string) => void;
  onResetFilters?: () => void;
  isFilterActive?: boolean;
}

const SUGGESTIONS = ['Dune', 'Sherlock Holmes', 'Science', '1984', 'Pride and Prejudice', 'Philosophy'];

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  onSelectSuggestion,
  onResetFilters,
  isFilterActive,
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-lg mx-auto space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto shadow-sm">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
          No matching books found
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {isFilterActive 
            ? 'We couldn\'t find any books that matched both your query and selected filters. Try broadening your filter criteria.'
            : `We couldn't find any books matching "${query}". Double-check spelling or try searching for a broader title or author.`
          }
        </p>
      </div>

      {isFilterActive && onResetFilters && (
        <button
          onClick={onResetFilters}
          className="px-4 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded-lg transition-colors"
        >
          Reset Applied Filters
        </button>
      )}

      <div className="pt-4 border-t border-stone-200/60 dark:border-slate-800">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 mb-3 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Try exploring one of these popular terms:</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((sug) => (
            <button
              key={sug}
              onClick={() => onSelectSuggestion(sug)}
              className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300 rounded-lg shadow-sm transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
