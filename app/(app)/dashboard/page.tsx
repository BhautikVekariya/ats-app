import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CandidatesOverTimeChart } from '@/components/dashboard/CandidatesOverTimeChart';
import { StageDistributionChart } from '@/components/dashboard/StageDistributionChart';
import { RecentApplicantsTable } from '@/components/dashboard/RecentApplicantsTable';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Users,
  UserPlus,
  Mic,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import type {
  DashboardMetrics,
  CandidatesOverTimePoint,
  StageDistributionPoint,
  Candidate,
} from '@/types';
import { subDays, format } from 'date-fns';

export const metadata: Metadata = { title: 'Dashboard' };

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const uid = user.id;

  // ── Metric counts ──────────────────────────────────────────────────────────
  const { data: stageCounts } = await supabase
    .from('candidates')
    .select('stage')
    .eq('user_id', uid);

  const metrics: DashboardMetrics = {
    total: stageCounts?.length ?? 0,
    applied: stageCounts?.filter((c) => c.stage === 'Applied').length ?? 0,
    screening: stageCounts?.filter((c) => c.stage === 'Screening').length ?? 0,
    interview: stageCounts?.filter((c) => c.stage === 'Interview').length ?? 0,
    offer: stageCounts?.filter((c) => c.stage === 'Offer').length ?? 0,
    hired: stageCounts?.filter((c) => c.stage === 'Hired').length ?? 0,
    rejected: stageCounts?.filter((c) => c.stage === 'Rejected').length ?? 0,
  };

  // ── Candidates over time (last 30 days) ───────────────────────────────────
  const thirtyDaysAgo = format(subDays(new Date(), 29), 'yyyy-MM-dd');
  const { data: overTimeData } = await supabase
    .from('candidates')
    .select('application_date')
    .eq('user_id', uid)
    .gte('application_date', thirtyDaysAgo)
    .order('application_date', { ascending: true });

  // Aggregate by date
  const dateCounts: Record<string, number> = {};
  (overTimeData ?? []).forEach((c) => {
    dateCounts[c.application_date] = (dateCounts[c.application_date] ?? 0) + 1;
  });
  const overTime: CandidatesOverTimePoint[] = Object.entries(dateCounts).map(
    ([date, count]) => ({ date, count })
  );

  // ── Stage distribution ─────────────────────────────────────────────────────
  const stageDistribution: StageDistributionPoint[] = [
    'Applied',
    'Screening',
    'Interview',
    'Offer',
    'Hired',
    'Rejected',
  ]
    .map((stage) => ({
      stage: stage as StageDistributionPoint['stage'],
      count:
        stageCounts?.filter((c) => c.stage === stage).length ?? 0,
    }))
    .filter((d) => d.count > 0);

  // ── Recent applicants ──────────────────────────────────────────────────────
  const { data: recentCandidates } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', uid)
    .order('created_at', { ascending: false })
    .limit(8);

  // ── Upcoming interviews ────────────────────────────────────────────────────
  const now = new Date().toISOString();
  const { data: upcomingInterviews } = await supabase
    .from('candidates')
    .select('*')
    .eq('user_id', uid)
    .gte('interview_date', now)
    .order('interview_date', { ascending: true })
    .limit(5);

  return (
    <div className="space-y-6">
      {/* Quick actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Overview of your recruitment pipeline
        </p>
        <Link href="/candidates">
          <Button size="sm" id="add-candidate-quick-action">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Candidate
          </Button>
        </Link>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <MetricCard
          title="Total Candidates"
          value={metrics.total}
          icon={<Users className="w-5 h-5" />}
          colorClass="bg-blue-50 text-blue-600"
        />
        <MetricCard
          title="New Applicants"
          value={metrics.applied}
          description="awaiting review"
          icon={<UserPlus className="w-5 h-5" />}
          colorClass="bg-gray-100 text-gray-600"
        />
        <MetricCard
          title="Interviewing"
          value={metrics.interview}
          description="active"
          icon={<Mic className="w-5 h-5" />}
          colorClass="bg-purple-50 text-purple-600"
        />
        <MetricCard
          title="Hired"
          value={metrics.hired}
          description="this pipeline"
          icon={<CheckCircle className="w-5 h-5" />}
          colorClass="bg-green-50 text-green-600"
        />
        <MetricCard
          title="Rejected"
          value={metrics.rejected}
          icon={<XCircle className="w-5 h-5" />}
          colorClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CandidatesOverTimeChart data={overTime} />
        <StageDistributionChart data={stageDistribution} />
      </div>

      {/* Bottom row: recent + upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
