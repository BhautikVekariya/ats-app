'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { candidateSchema, type CandidateSchema } from '@/lib/validations/candidate';
import { STAGES, type Candidate } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface CandidateFormProps {
  defaultValues?: Partial<Candidate>;
  onSubmit: (data: CandidateSchema) => Promise<void>;
  isSubmitting: boolean;
  submitLabel?: string;
}

export function CandidateForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  submitLabel = 'Save Candidate',
}: CandidateFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<CandidateSchema>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      full_name: defaultValues?.full_name ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      job_title: defaultValues?.job_title ?? '',
      resume_url: defaultValues?.resume_url ?? '',
      stage: defaultValues?.stage ?? 'Applied',
      application_date:
        defaultValues?.application_date ?? format(new Date(), 'yyyy-MM-dd'),
      interview_date: defaultValues?.interview_date
        ? defaultValues.interview_date.slice(0, 16) // datetime-local needs YYYY-MM-DDTHH:mm
        : '',
      notes: defaultValues?.notes ?? '',
    },
  });

  const currentStage = watch('stage');

  useEffect(() => {
    if (defaultValues) {
      reset({
        full_name: defaultValues.full_name ?? '',
        email: defaultValues.email ?? '',
        phone: defaultValues.phone ?? '',
        job_title: defaultValues.job_title ?? '',
        resume_url: defaultValues.resume_url ?? '',
        stage: defaultValues.stage ?? 'Applied',
        application_date:
          defaultValues.application_date ?? format(new Date(), 'yyyy-MM-dd'),
        interview_date: defaultValues.interview_date
          ? defaultValues.interview_date.slice(0, 16)
          : '',
        notes: defaultValues.notes ?? '',
      });
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Row 1: Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="full_name">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="full_name"
            placeholder="Alice Thornton"
            {...register('full_name')}
            aria-invalid={!!errors.full_name}
          />
          {errors.full_name && (
            <p className="text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="alice@example.com"
            {...register('email')}
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Row 2: Phone + Job Title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1-555-0100"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="job_title">
            Job Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="job_title"
            placeholder="Senior Frontend Engineer"
            {...register('job_title')}
            aria-invalid={!!errors.job_title}
          />
          {errors.job_title && (
            <p className="text-xs text-red-500">{errors.job_title.message}</p>
          )}
        </div>
      </div>

      {/* Row 3: Stage + Application Date */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="stage">
            Hiring Stage <span className="text-red-500">*</span>
          </Label>
          <Select
            value={currentStage}
            onValueChange={(val) => setValue('stage', val as CandidateSchema['stage'])}
          >
            <SelectTrigger id="stage" aria-invalid={!!errors.stage}>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stage && (
            <p className="text-xs text-red-500">{errors.stage.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="application_date">
            Application Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="application_date"
            type="date"
            {...register('application_date')}
            aria-invalid={!!errors.application_date}
          />
          {errors.application_date && (
            <p className="text-xs text-red-500">
              {errors.application_date.message}
            </p>
          )}
        </div>
      </div>

      {/* Row 4: Interview Date + Resume URL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="interview_date">Interview Date & Time</Label>
          <Input
            id="interview_date"
            type="datetime-local"
            {...register('interview_date')}
          />
          {errors.interview_date && (
            <p className="text-xs text-red-500">
              {errors.interview_date.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="resume_url">Resume URL</Label>
          <Input
            id="resume_url"
            type="url"
            placeholder="https://resume.example.com/alice.pdf"
            {...register('resume_url')}
          />
          {errors.resume_url && (
            <p className="text-xs text-red-500">{errors.resume_url.message}</p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Recruiter Notes</Label>
        <Textarea
          id="notes"
          rows={3}
          placeholder="Add notes about this candidate…"
          className="resize-none"
          {...register('notes')}
        />
        {errors.notes && (
          <p className="text-xs text-red-500">{errors.notes.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
        id="submit-candidate-form"
      >
        {isSubmitting ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
