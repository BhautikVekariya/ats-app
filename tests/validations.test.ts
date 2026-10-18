import { describe, it, expect } from 'vitest';
import { candidateSchema, loginSchema, signupSchema } from '../lib/validations/candidate';

describe('candidateSchema', () => {
  const validCandidate = {
    full_name: 'Alice Thornton',
    email: 'alice@example.com',
    phone: '+1-555-0101',
    job_title: 'Senior Frontend Engineer',
    resume_url: 'https://example.com/resume.pdf',
    stage: 'Applied' as const,
    application_date: '2024-10-01',
    interview_date: '',
    notes: 'Looks great!',
  };

  it('validates a correct candidate', () => {
    const result = candidateSchema.safeParse(validCandidate);
    expect(result.success).toBe(true);
  });

  it('rejects missing required fields', () => {
    const result = candidateSchema.safeParse({
      ...validCandidate,
      full_name: '',
      email: '',
      job_title: '',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const fields = result.error.issues.map((i) => i.path[0]);
      expect(fields).toContain('full_name');
      expect(fields).toContain('email');
      expect(fields).toContain('job_title');
    }
  });

  it('rejects invalid email', () => {
    const result = candidateSchema.safeParse({
      ...validCandidate,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid stage', () => {
    const result = candidateSchema.safeParse({
      ...validCandidate,
      stage: 'Pending',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid stages', () => {
    const stages = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected'];
    stages.forEach((stage) => {
      const result = candidateSchema.safeParse({ ...validCandidate, stage });
      expect(result.success).toBe(true);
    });
  });

  it('rejects invalid resume URL', () => {
    const result = candidateSchema.safeParse({
      ...validCandidate,
      resume_url: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it('accepts empty optional fields', () => {
    const result = candidateSchema.safeParse({
      ...validCandidate,
      phone: '',
      resume_url: '',
      interview_date: '',
      notes: '',
    });
    expect(result.success).toBe(true);
  });
});

describe('loginSchema', () => {
  it('validates correct credentials', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({
      email: 'user@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('validates matching passwords', () => {
    const result = signupSchema.safeParse({
      email: 'new@example.com',
      password: 'securepass',
      confirmPassword: 'securepass',
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({
      email: 'new@example.com',
      password: 'securepass',
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('rejects password under 8 characters', () => {
    const result = signupSchema.safeParse({
      email: 'new@example.com',
      password: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
  });
});
