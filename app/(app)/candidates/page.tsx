import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CandidatesClient } from './CandidatesClient';
import type { PaginatedCandidates, Candidate } from '@/types';

export const metadata: Metadata = { title: 'Candidates' };
export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

export default async function CandidatesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Initial server-side load (page 1, newest first, no filters)
  const { data, count } = await supabase
    .from('candidates')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('application_date', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  const initialData: PaginatedCandidates = {
    data: (data ?? []) as Candidate[],
    count: count ?? 0,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil((count ?? 0) / PAGE_SIZE),
  };

  return <CandidatesClient initialData={initialData} userId={user.id} />;
}
