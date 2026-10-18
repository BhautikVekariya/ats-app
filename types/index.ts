export type Stage =
  | 'Applied'
  | 'Screening'
  | 'Interview'
  | 'Offer'
  | 'Hired'
  | 'Rejected';

export const STAGES: Stage[] = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

export interface Candidate {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  job_title: string;
  resume_url: string | null;
  stage: Stage;
  application_date: string; // ISO date string YYYY-MM-DD
  interview_date: string | null; // ISO timestamptz
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CandidateStageHistory {
  id: string;
  candidate_id: string;
  user_id: string;
  from_stage: Stage | null;
  to_stage: Stage;
  changed_at: string;
  note: string | null;
}

export interface DashboardMetrics {
  total: number;
  applied: number;
  screening: number;
  interview: number;
  offer: number;
  hired: number;
  rejected: number;
}

export interface CandidatesOverTimePoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface StageDistributionPoint {
  stage: Stage;
  count: number;
}

export interface CandidateFilters {
  search: string;
  stage: Stage | '';
  dateFrom: string;
  dateTo: string;
  sortBy: 'full_name' | 'application_date' | 'updated_at';
  sortOrder: 'asc' | 'desc';
  page: number;
  pageSize: number;
}

export interface PaginatedCandidates {
  data: Candidate[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CandidateFormValues {
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  resume_url: string;
  stage: Stage;
  application_date: string;
  interview_date: string;
  notes: string;
}
