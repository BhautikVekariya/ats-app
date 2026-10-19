
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { CandidatesClient } from './CandidatesClient';
import type { PaginatedCandidates, Candidate } from '@/types';

export const metadata: Metadata = {
  title: 'Candidates',
};

export const instant = false;

const PAGE_SIZE = 10;

export default async function CandidatesPage() {
  const supabase = await createClient();

  // Get the currently authenticated user.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch only candidates belonging to this authenticated user.
  const { data, count, error } = await supabase
    .from('candidates')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('application_date', { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    console.error('Failed to fetch candidates:', error.message);
  }

  const candidates = (data ?? []) as Candidate[];
  const totalCount = count ?? 0;

  const initialData: PaginatedCandidates = {
    data: candidates,
    count: totalCount,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: Math.ceil(totalCount / PAGE_SIZE),
  };

  return (
    <CandidatesClient
      initialData={initialData}
      userId={user.id}
    />
  );
}
