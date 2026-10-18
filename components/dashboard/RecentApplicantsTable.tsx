import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import type { Candidate } from '@/types';
import { StageBadge } from '@/components/candidates/StageBadge';
import { ArrowRight } from 'lucide-react';

interface RecentApplicantsTableProps {
  candidates: Candidate[];
  loading?: boolean;
}

export function RecentApplicantsTable({
  candidates,
  loading,
}: RecentApplicantsTableProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="w-40 h-5 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-gray-100 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="w-32 h-3.5 bg-gray-200 rounded" />
                <div className="w-48 h-3 bg-gray-100 rounded" />
              </div>
              <div className="w-20 h-5 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Recent Applicants</h3>
        <Link
          href="/candidates"
          className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {candidates.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          No candidates yet. Add your first one!
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {candidates.map((c) => (
            <div key={c.id} className="flex items-center gap-3 py-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-blue-600">
                  {c.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/candidates/${c.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                >
                  {c.full_name}
                </Link>
                <p className="text-xs text-gray-500 truncate">{c.job_title}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <StageBadge stage={c.stage} />
                <span className="text-xs text-gray-400 hidden sm:block">
                  {format(parseISO(c.application_date), 'MMM d')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
