'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CandidateForm } from './CandidateForm';
import type { Candidate } from '@/types';
import type { CandidateSchema } from '@/lib/validations/candidate';

// ─── Add/Edit Dialog ─────────────────────────────────────────────────────────

interface CandidateDialogProps {
  open: boolean;
  onClose: () => void;
  candidate?: Candidate;
  onSubmit: (data: CandidateSchema) => Promise<void>;
  isSubmitting: boolean;
}

export function CandidateDialog({
  open,
  onClose,
  candidate,
  onSubmit,
  isSubmitting,
}: CandidateDialogProps) {
  const isEdit = !!candidate;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Candidate' : 'Add New Candidate'}
          </DialogTitle>
        </DialogHeader>
        <div className="pt-2">
          <CandidateForm
            defaultValues={candidate}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            submitLabel={isEdit ? 'Update Candidate' : 'Add Candidate'}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Delete Confirmation Dialog ───────────────────────────────────────────────

interface DeleteConfirmDialogProps {
  open: boolean;
  candidateName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteConfirmDialog({
  open,
  candidateName,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold text-gray-900">{candidateName}</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            id="confirm-delete-button"
          >
            {isDeleting ? 'Deleting…' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
