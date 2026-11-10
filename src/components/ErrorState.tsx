import React from 'react';
import { AlertCircle, RefreshCw, BookOpen } from 'lucide-react';

interface ErrorStateProps {
  errorMessage: string;
  onRetry: () => void;
  onLoadCurated: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  errorMessage,
  onRetry,
  onLoadCurated,
}) => {
  return (
    <div className="text-center py-16 px-4 max-w-lg mx-auto space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
          Unable to fetch books
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {errorMessage || 'The Open Library service is currently unreachable. This may be due to rate limiting or a temporary connection issue.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Connection</span>
        </button>

        <button
          onClick={onLoadCurated}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-stone-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
        >
          <BookOpen className="w-4 h-4 text-indigo-500" />
          <span>View Curated Classics</span>
        </button>
      </div>
    </div>
  );
};
