'use client';

import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { Pencil, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Candidate } from '@/types';
import type { CandidateFilters } from '@/types';
import { StageBadge } from './StageBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CandidatesTableProps {
  candidates: Candidate[];
  totalCount: number;
  filters: CandidateFilters;
  onPageChange: (page: number) => void;
  onEdit: (candidate: Candidate) => void;
  onDelete: (candidate: Candidate) => void;
  loading?: boolean;
}

export function CandidatesTable({
  candidates,
  totalCount,
  filters,
  onPageChange,
  onEdit,
  onDelete,
  loading,
}: CandidatesTableProps) {
  const totalPages = Math.ceil(totalCount / filters.pageSize);
  const start = (filters.page - 1) * filters.pageSize + 1;
  const end = Math.min(filters.page * filters.pageSize, totalCount);

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
        <div className="divide-y divide-gray-100">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="w-36 h-3.5 bg-gray-200 rounded" />
                <div className="w-48 h-3 bg-gray-100 rounded" />
              </div>
              <div className="w-20 h-5 bg-gray-100 rounded-full" />
              <div className="w-16 h-3 bg-gray-100 rounded" />
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gray-100 rounded" />
                <div className="w-8 h-8 bg-gray-100 rounded" />
                <div className="w-8 h-8 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          No candidates found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Candidate
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">
                  Job Title
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Stage
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">
                  Applied
                </th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden xl:table-cell">
                  Interview
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {candidates.map((candidate) => (
                <tr
                  key={candidate.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-blue-600">
                          {candidate.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {candidate.full_name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {candidate.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell truncate max-w-[180px]">
                    {candidate.job_title}
                  </td>
                  <td className="px-4 py-3">
                    <StageBadge stage={candidate.stage} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell whitespace-nowrap">
                    {format(parseISO(candidate.application_date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs hidden xl:table-cell whitespace-nowrap">
                    {candidate.interview_date
                      ? format(parseISO(candidate.interview_date), 'MMM d, h:mm a')
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/candidates/${candidate.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-400 hover:text-blue-600"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-gray-700"
                        onClick={() => onEdit(candidate)}
                        title="Edit candidate"
                        id={`edit-candidate-${candidate.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                        onClick={() => onDelete(candidate)}
                        title="Delete candidate"
                        id={`delete-candidate-${candidate.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {start}–{end} of {totalCount.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(filters.page - 1)}
              disabled={filters.page <= 1}
              id="prev-page-button"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (filters.page <= 4) {
                pageNum = i + 1;
              } else if (filters.page >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = filters.page - 3 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={filters.page === pageNum ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className={cn('min-w-[32px]', filters.page === pageNum && 'pointer-events-none')}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(filters.page + 1)}
              disabled={filters.page >= totalPages}
              id="next-page-button"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
