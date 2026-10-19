
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { CandidateDetailClient } from './CandidateDetailClient';
import type { Candidate, CandidateStageHistory } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { title: 'Candidate Details' };
  }

  const { data } = await supabase
    .from('candidates')
    .select('full_name')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  return {
    title: data?.full_name ?? 'Candidate Details',
  };
}

export default async function CandidateDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch the candidate belonging to this user
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (candidateError) {
    console.error('Failed to fetch candidate:', candidateError.message);
  }

  if (!candidate) {
    notFound();
  }

  // Fetch candidate stage history
  const { data: history, error: historyError } = await supabase
    .from('candidate_stage_history')
    .select('*')
    .eq('candidate_id', id)
    .order('changed_at', { ascending: false });

  if (historyError) {
    console.error('Failed to fetch candidate stage history:', historyError.message);
  }

  return (
    <CandidateDetailClient
      candidate={candidate as Candidate}
      stageHistory={(history ?? []) as CandidateStageHistory[]}
      userId={user.id}
    />
  );
}
