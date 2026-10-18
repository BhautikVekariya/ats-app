import { format, parseISO } from 'date-fns';
import type { Candidate } from '@/types';
import { Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

interface UpcomingInterviewsProps {
  candidates: Candidate[];
  loading?: boolean;
}

export function UpcomingInterviews({
  candidates,
  loading,
}: UpcomingInterviewsProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="w-40 h-5 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="w-32 h-3.5 bg-gray-200 rounded" />
                <div className="w-24 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-purple-500" />
        <h3 className="text-sm font-semibold text-gray-700">Upcoming Interviews</h3>
      </div>

      {candidates.length === 0 ? (
        <div className="py-6 text-center text-sm text-gray-400">
          No interviews scheduled
        </div>
      ) : (
        <div className="space-y-3">
          {candidates.map((c) => (
            <div key={c.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/candidates/${c.id}`}
                  className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                >
                  {c.full_name}
                </Link>
                <p className="text-xs text-gray-500 truncate">{c.job_title}</p>
                {c.interview_date && (
                  <p className="text-xs font-medium text-purple-600 mt-0.5">
                    {format(parseISO(c.interview_date), 'MMM d, yyyy · h:mm a')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
