'use client';

import { useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Candidate, CandidateFilters, PaginatedCandidates } from '@/types';
import type { CandidateSchema } from '@/lib/validations/candidate';
import { CandidatesTable } from '@/components/candidates/CandidatesTable';
import { CandidateFiltersBar } from '@/components/candidates/CandidateFilters';
import { CandidateDialog, DeleteConfirmDialog } from '@/components/candidates/CandidateDialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_FILTERS: CandidateFilters = {
  search: '',
  stage: '',
  dateFrom: '',
  dateTo: '',
  sortBy: 'application_date',
  sortOrder: 'desc',
  page: 1,
  pageSize: 10,
};

interface CandidatesClientProps {
  initialData: PaginatedCandidates;
  userId: string;
}

export function CandidatesClient({ initialData, userId }: CandidatesClientProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState<CandidateFilters>(DEFAULT_FILTERS);
  const [paginatedData, setPaginatedData] = useState<PaginatedCandidates>(initialData);
  const [loading, setLoading] = useState(false);

  // Dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Candidate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function fetchCandidates(newFilters: CandidateFilters) {
    setLoading(true);
    try {
      let query = supabase
        .from('candidates')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      // Search
      if (newFilters.search) {
        query = query.or(
          `full_name.ilike.%${newFilters.search}%,email.ilike.%${newFilters.search}%,job_title.ilike.%${newFilters.search}%`
        );
      }

      // Stage filter
      if (newFilters.stage) {
        query = query.eq('stage', newFilters.stage);
      }

      // Date range
      if (newFilters.dateFrom) {
        query = query.gte('application_date', newFilters.dateFrom);
      }
      if (newFilters.dateTo) {
        query = query.lte('application_date', newFilters.dateTo);
      }

      // Sort
      query = query.order(newFilters.sortBy, {
        ascending: newFilters.sortOrder === 'asc',
      });

      // Pagination
      const from = (newFilters.page - 1) * newFilters.pageSize;
      const to = from + newFilters.pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      const total = count ?? 0;
      setPaginatedData({
        data: (data ?? []) as Candidate[],
        count: total,
        page: newFilters.page,
        pageSize: newFilters.pageSize,
        totalPages: Math.ceil(total / newFilters.pageSize),
      });
    } catch (err) {
      toast.error('Failed to load candidates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleFiltersChange = useCallback(
    (partial: Partial<CandidateFilters>) => {
      const newFilters = { ...filters, ...partial };
      setFilters(newFilters);
      fetchCandidates(newFilters);
    },
    [filters]
  );

  // ── Add candidate ──────────────────────────────────────────────────────────
  async function handleAdd(data: CandidateSchema) {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('candidates').insert({
        user_id: userId,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        job_title: data.job_title,
        resume_url: data.resume_url || null,
        stage: data.stage,
        application_date: data.application_date,
        interview_date: data.interview_date || null,
        notes: data.notes || null,
      });
      if (error) {
        if (error.code === '23505') {
          toast.error('A candidate with this email already exists.');
        } else {
          toast.error(error.message);
        }
        return;
      }
      toast.success('Candidate added successfully');
      setAddOpen(false);
      await fetchCandidates(filters);
      startTransition(() => router.refresh());
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Edit candidate ─────────────────────────────────────────────────────────
  async function handleEdit(data: CandidateSchema) {
    if (!editCandidate) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase
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
        .eq('id', editCandidate.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success('Candidate updated');
      setEditCandidate(null);
      await fetchCandidates(filters);
      startTransition(() => router.refresh());
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Delete candidate ───────────────────────────────────────────────────────
  async function handleDelete() {
    if (!deleteCandidate) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', deleteCandidate.id);
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success(`${deleteCandidate.full_name} deleted`);
      setDeleteCandidate(null);
      await fetchCandidates(filters);
      startTransition(() => router.refresh());
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-gray-500">
            Manage and track your candidates
          </p>
        </div>
        <Button
          onClick={() => setAddOpen(true)}
          size="sm"
          id="add-candidate-button"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add Candidate
        </Button>
      </div>

      {/* Filters */}
      <CandidateFiltersBar
        filters={filters}
        onChange={handleFiltersChange}
        totalCount={paginatedData.count}
      />

      {/* Table */}
      <CandidatesTable
        candidates={paginatedData.data}
        totalCount={paginatedData.count}
        filters={filters}
        onPageChange={(page) => handleFiltersChange({ page })}
        onEdit={(c) => setEditCandidate(c)}
        onDelete={(c) => setDeleteCandidate(c)}
        loading={loading || isPending}
      />

      {/* Add dialog */}
      <CandidateDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        isSubmitting={isSubmitting}
      />

      {/* Edit dialog */}
      <CandidateDialog
        open={!!editCandidate}
        onClose={() => setEditCandidate(null)}
        candidate={editCandidate ?? undefined}
        onSubmit={handleEdit}
        isSubmitting={isSubmitting}
      />

      {/* Delete confirm */}
      {deleteCandidate && (
        <DeleteConfirmDialog
          open={!!deleteCandidate}
          candidateName={deleteCandidate.full_name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteCandidate(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
