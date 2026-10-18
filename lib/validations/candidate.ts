import { z } from 'zod';
import { STAGES } from '@/types';

export const candidateSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be under 100 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z
    .string()
    .max(20, 'Phone number too long')
    .optional()
    .or(z.literal('')),
  job_title: z
    .string()
    .min(2, 'Job title must be at least 2 characters')
    .max(100, 'Job title must be under 100 characters'),
  resume_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  stage: z.enum(STAGES as [string, ...string[]], {
    errorMap: () => ({ message: 'Please select a valid stage' }),
  }),
  application_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date (YYYY-MM-DD)'),
  interview_date: z
    .string()
    .optional()
    .or(z.literal('')),
  notes: z
    .string()
    .max(2000, 'Notes must be under 2000 characters')
    .optional()
    .or(z.literal('')),
});

export type CandidateSchema = z.infer<typeof candidateSchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
