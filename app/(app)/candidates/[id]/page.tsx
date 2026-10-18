import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import { CandidateDetailClient } from './CandidateDetailClient';
import type { Candidate, CandidateStageHistory } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('candidates')
    .select('full_name')
    .eq('id', id)
    .single();
  return {
    title: data?.full_name ?? 'Candidate Details',
  };
}

export const dynamic = 'force-dynamic';

export default async function CandidateDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: candidate } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (!candidate) notFound();

  const { data: history } = await supabase
    .from('candidate_stage_history')
    .select('*')
    .eq('candidate_id', id)
    .order('changed_at', { ascending: false });

  return (
    <CandidateDetailClient
      candidate={candidate as Candidate}
      stageHistory={(history ?? []) as CandidateStageHistory[]}
      userId={user.id}
    />
  );
}
