import React from 'react';
import { Filter, RotateCcw, ArrowUpDown, Image as ImageIcon, Calendar } from 'lucide-react';
import { EraFilter, FilterState, SortOption } from '../types/book';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalFetchedCount: number;
  availableCategories: string[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  totalFilteredCount,
  totalFetchedCount,
  availableCategories,
}) => {
  const isFiltered = 
    filterState.category !== 'all' || 
    filterState.era !== 'all' || 
    filterState.hasCoverOnly || 
    filterState.sortBy !== 'relevance';

  return (
    <div className="bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 transition-colors">
      
      {/* Top Row: Category Tabs */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" />
            <span>Category / Genre</span>
          </span>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Scrollable category buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => onFilterChange({ category: 'all' })}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              filterState.category === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            All Genres
          </button>
          {availableCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onFilterChange({ category: cat })}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterState.category === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-stone-100 dark:bg-slate-800/80" />

      {/* Controls Row: Era Filter, Sort Dropdown & Cover Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Era Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="era-select" className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5" />
              <span>Publication:</span>
            </label>
            <select
              id="era-select"
              value={filterState.era}
              onChange={(e) => onFilterChange({ era: e.target.value as EraFilter })}
              className="bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="all">All Eras</option>
              <option value="pre_1950">Pre-1950 (Classics)</option>
              <option value="1950_1999">1950 – 1999</option>
              <option value="2000_2015">2000 – 2015</option>
              <option value="post_2015">2016 – Present</option>
            </select>
          </div>

          {/* Sort Option */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </label>
            <select
              id="sort-select"
              value={filterState.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as SortOption })}
              className="bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
            >
              <option value="relevance">Relevance</option>
              <option value="title_asc">Title (A – Z)</option>
              <option value="title_desc">Title (Z – A)</option>
              <option value="year_desc">Newest First</option>
              <option value="year_asc">Oldest First</option>
              <option value="editions_desc">Most Editions</option>
            </select>
          </div>

          {/* Has Cover Only Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 dark:text-slate-300 font-medium select-none">
            <input
              type="checkbox"
              checked={filterState.hasCoverOnly}
              onChange={(e) => onFilterChange({ hasCoverOnly: e.target.checked })}
              className="rounded border-stone-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
            />
            <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            <span>Covers only</span>
          </label>
        </div>

        {/* Results Counter */}
        <div className="text-slate-500 dark:text-slate-400 tabular-nums">
          Showing <span className="font-semibold text-slate-900 dark:text-slate-100">{totalFilteredCount}</span>
          {totalFilteredCount !== totalFetchedCount && (
            <span> of {totalFetchedCount}</span>
          )} books
        </div>

      </div>
    </div>
  );
};
