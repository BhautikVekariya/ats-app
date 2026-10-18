'use client';

import { useCallback, useRef } from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { STAGES, type Stage } from '@/types';
import type { CandidateFilters } from '@/types';

interface CandidateFiltersBarProps {
  filters: CandidateFilters;
  onChange: (filters: Partial<CandidateFilters>) => void;
  totalCount: number;
}

export function CandidateFiltersBar({
  filters,
  onChange,
  totalCount,
}: CandidateFiltersBarProps) {
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => {
        onChange({ search: value, page: 1 });
      }, 350);
    },
    [onChange]
  );

  const hasActiveFilters =
    filters.search !== '' ||
    filters.stage !== '' ||
    filters.dateFrom !== '' ||
    filters.dateTo !== '';

  function clearFilters() {
    onChange({ search: '', stage: '', dateFrom: '', dateTo: '', page: 1 });
    // Reset the input field
    const input = document.getElementById('search-candidates') as HTMLInputElement;
    if (input) input.value = '';
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            id="search-candidates"
            placeholder="Search by name, email, or job title…"
            defaultValue={filters.search}
            onChange={handleSearchChange}
            className="pl-9"
          />
        </div>

        {/* Stage filter */}
        <Select
          value={filters.stage || 'all'}
          onValueChange={(val) =>
            onChange({ stage: val === 'all' ? '' : (val as Stage), page: 1 })
          }
        >
          <SelectTrigger className="w-full sm:w-44" id="filter-stage">
            <SlidersHorizontal className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder="All Stages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {STAGES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onValueChange={(val) => {
            const [sortBy, sortOrder] = val.split('-') as [
              CandidateFilters['sortBy'],
              CandidateFilters['sortOrder']
            ];
            onChange({ sortBy, sortOrder, page: 1 });
          }}
        >
          <SelectTrigger className="w-full sm:w-48" id="sort-candidates">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="application_date-desc">Newest First</SelectItem>
            <SelectItem value="application_date-asc">Oldest First</SelectItem>
            <SelectItem value="full_name-asc">Name A → Z</SelectItem>
            <SelectItem value="full_name-desc">Name Z → A</SelectItem>
            <SelectItem value="updated_at-desc">Last Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Date range */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-gray-500 whitespace-nowrap">Applied:</span>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onChange({ dateFrom: e.target.value, page: 1 })}
            className="w-full"
            id="filter-date-from"
          />
          <span className="text-gray-400">—</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onChange({ dateTo: e.target.value, page: 1 })}
            className="w-full"
            id="filter-date-to"
          />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700 gap-1.5"
              id="clear-filters-button"
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </Button>
          )}
          <span className="text-sm text-gray-500">
            {totalCount.toLocaleString()} result{totalCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>
    </div>
  );
}
