
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CandidatesOverTimeChart } from '@/components/dashboard/CandidatesOverTimeChart';
import { StageDistributionChart } from '@/components/dashboard/StageDistributionChart';
import { RecentApplicantsTable } from '@/components/dashboard/RecentApplicantsTable';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Mic,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type {
  DashboardMetrics,
  CandidatesOverTimePoint,
  StageDistributionPoint,
  Candidate,
} from '@/types';
import { subDays, format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Dashboard',
};
export const instant = false;

export default async function DashboardPage() {
  const supabase = await createClient();

  // Verify the logged-in user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const uid = user.id;

  // Fetch candidate stages
  const { data: stageCounts, error: stagesError } = await supabase
    .from('candidates')
    .select('stage')
    .eq('user_id', uid);

  if (stagesError) {
    console.error('Failed to fetch candidate metrics:', stagesError.message);
  }

  const candidatesByStage = stageCounts ?? [];

  const metrics: DashboardMetrics = {
    total: candidatesByStage.length,
    applied: candidatesByStage.filter((c) => c.stage === 'Applied').length,
    screening: candidatesByStage.filter((c) => c.stage === 'Screening').length,
    interview: candidatesByStage.filter((c) => c.stage === 'Interview').length,
    offer: candidatesByStage.filter((c) => c.stage === 'Offer').length,
    hired: candidatesByStage.filter((c) => c.stage === 'Hired').length,
    rejected: candidatesByStage.filter((c) => c.stage === 'Rejected').length,
  };

  // Fetch applications from the last 30 days
  const thirtyDaysAgo = format(subDays(new Date(), 29), 'yyyy-MM-dd');

  const { data: overTimeData, error: overTimeError } = await supabase
    .from('candidates')
    .select('application_date')
    .eq('user_id', uid)
    .gte('application_date', thirtyDaysAgo)
    .order('application_date', { ascending: true });

  if (overTimeError) {
    console.error('Failed to fetch application history:', overTimeError.message);
  }

  // Group applications by date
  const dateCounts: Record<string, number> = {};

  (overTimeData ?? []).forEach((candidate) => {
    const date = candidate.application_date;

    if (date) {
      dateCounts[date] = (dateCounts[date] ?? 0) + 1;
    }
  });

  const overTime: CandidatesOverTimePoint[] = Object.entries(dateCounts).map(
    ([date, count]) => ({
      date,
      count,
    })
  );

  // Calculate candidate stage distribution
  const stages = [
    'Applied',
    'Screening',
    'Interview',
    'Offer',
    'Hired',
    'Rejected',
  ] as const;

  const stageDistribution: StageDistributionPoint[] = stages
    .map((stage) => ({
      stage: stage as StageDistributionPoint['stage'],
      count: candidatesByStage.filter((c) => c.stage === stage).length,
    }))
    .filter((item) => item.count > 0);

  // Fetch recent candidates
  const { data: recentCandidates, error: recentError } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(8);

  if (recentError) {
    console.error('Failed to fetch recent candidates:', recentError.message);
  }

  // Fetch upcoming interviews
  const now = new Date().toISOString();

  const { data: upcomingInterviews, error: interviewsError } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', uid)
    .gte('interview_date', now)
    .order('interview_date', { ascending: true })
    .limit(5);

  if (interviewsError) {
    console.error('Failed to fetch upcoming interviews:', interviewsError.message);
  }

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-gray-500">
          Overview of your recruitment pipeline
        </p>

        <Link
          href="/candidates"
          id="add-candidate-quick-action"
          className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 px-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Candidate
        </Link>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <MetricCard
          title="Total Candidates"
          value={metrics.total}
          icon={<Users className="h-5 w-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />

        <MetricCard
          title="New Applicants"
          value={metrics.applied}
          description="awaiting review"
          icon={<UserPlus className="h-5 w-5" />}
          colorClass="bg-gray-100 text-gray-600"
        />

        <MetricCard
          title="Interviewing"
          value={metrics.interview}
          description="active"
          icon={<Mic className="h-5 w-5" />}
          colorClass="bg-purple-50 text-purple-600"
        />

        <MetricCard
          title="Hired"
          value={metrics.hired}
          description="this pipeline"
          icon={<CheckCircle className="h-5 w-5" />}
          colorClass="bg-green-50 text-green-600"
        />

        <MetricCard
          title="Rejected"
          value={metrics.rejected}
          icon={<XCircle className="h-5 w-5" />}
          colorClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CandidatesOverTimeChart data={overTime} />
        <StageDistributionChart data={stageDistribution} />
      </div>

      {/* Recent applicants and upcoming interviews */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentApplicantsTable
            candidates={(recentCandidates ?? []) as Candidate[]}
          />
        </div>

        <UpcomingInterviews
          candidates={(upcomingInterviews ?? []) as Candidate[]}
        />
      </div>
    </div>
  );
}
