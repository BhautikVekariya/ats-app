'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import type { Candidate, CandidateStageHistory, Stage } from '@/types';
import type { CandidateSchema } from '@/lib/validations/candidate';
import { StageBadge } from '@/components/candidates/StageBadge';
import { StageSelector } from '@/components/candidates/StageSelector';
import { CandidateDialog, DeleteConfirmDialog } from '@/components/candidates/CandidateDialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  StickyNote,
  Pencil,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';

interface CandidateDetailClientProps {
  candidate: Candidate;
  stageHistory: CandidateStageHistory[];
  userId: string;
}

function InfoRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  href?: string;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium mb-0.5">{label}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            {value}
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <p className="text-sm text-gray-900">{value}</p>
        )}
      </div>
    </div>
  );
}

export function CandidateDetailClient({
  candidate: initialCandidate,
  stageHistory,
  userId,
}: CandidateDetailClientProps) {
  const router = useRouter();
  const supabase = createClient();

  const [candidate, setCandidate] = useState<Candidate>(initialCandidate);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleEdit(data: CandidateSchema) {
    setIsSubmitting(true);
    try {
      const { data: updated, error } = await supabase
        .from('candidates')
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          job_title: data.job_title,
          resume_url: data.resume_url || null,
          stage: data.stage,
          application_date: data.application_date,
          interview_date: data.interview_date || null,
          notes: data.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', candidate.id)
        .select()
        .single();
      if (error) {
        toast.error(error.message);
        return;
      }
      setCandidate(updated as Candidate);
      setEditOpen(false);
      toast.success('Candidate updated');
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidate.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(`${candidate.full_name} deleted`);
      router.push('/candidates');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleStageChange(newStage: Stage) {
    setCandidate((prev) => ({ ...prev, stage: newStage }));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back + Actions */}
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/candidates"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditOpen(true)}
            id="edit-candidate-detail-button"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:bg-red-50 border-red-200"
            onClick={() => setDeleteOpen(true)}
            id="delete-candidate-detail-button"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-blue-600">
                  {candidate.full_name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-900">
                  {candidate.full_name}
                </h2>
                <p className="text-sm text-gray-500">{candidate.job_title}</p>
                <div className="mt-2">
                  <StageSelector
                    candidate={candidate}
                    onStageChange={handleStageChange}
                  />
                </div>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="space-y-4">
              <InfoRow
                icon={<Mail className="w-4 h-4" />}
                label="Email"
                value={candidate.email}
                href={`mailto:${candidate.email}`}
              />
              <InfoRow
                icon={<Phone className="w-4 h-4" />}
                label="Phone"
                value={candidate.phone}
                href={candidate.phone ? `tel:${candidate.phone}` : undefined}
              />
              <InfoRow
                icon={<Briefcase className="w-4 h-4" />}
                label="Applied For"
                value={candidate.job_title}
              />
              <InfoRow
                icon={<Calendar className="w-4 h-4" />}
                label="Application Date"
                value={format(parseISO(candidate.application_date), 'MMMM d, yyyy')}
              />
              {candidate.interview_date && (
                <InfoRow
                  icon={<Clock className="w-4 h-4" />}
                  label="Interview Scheduled"
                  value={format(
                    parseISO(candidate.interview_date),
                    'MMMM d, yyyy · h:mm a'
                  )}
                />
              )}
              {candidate.resume_url && (
                <InfoRow
                  icon={<FileText className="w-4 h-4" />}
                  label="Resume"
                  value="View Resume"
                  href={candidate.resume_url}
                />
              )}
            </div>

            {candidate.notes && (
              <>
                <Separator className="my-6" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StickyNote className="w-4 h-4 text-gray-400" />
                    <p className="text-xs font-medium text-gray-500">
                      Recruiter Notes
                    </p>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {candidate.notes}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400">
              Added{' '}
              {format(parseISO(candidate.created_at), 'MMM d, yyyy')} ·
              Last updated{' '}
              {format(parseISO(candidate.updated_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Stage History */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Stage History
            </h3>
            {stageHistory.length === 0 ? (
              <p className="text-xs text-gray-400">No stage changes recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {stageHistory.map((h) => (
                  <div key={h.id} className="flex items-start gap-2">
                    <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {h.from_stage && (
                          <>
                            <StageBadge stage={h.from_stage} />
                            <span className="text-xs text-gray-400">→</span>
                          </>
                        )}
                        <StageBadge stage={h.to_stage} />
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {format(parseISO(h.changed_at), 'MMM d, yyyy · h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <CandidateDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        candidate={candidate}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />

      {/* Delete dialog */}
      <DeleteConfirmDialog
        open={deleteOpen}
        candidateName={candidate.full_name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        isDeleting={isDeleting}
      />
    </div>
  );
}
