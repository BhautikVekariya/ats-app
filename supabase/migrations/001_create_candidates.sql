-- =============================================================
-- Migration 001: Core Tables, Indexes, and RLS Policies
-- Run this in Supabase SQL Editor
-- =============================================================

-- -------------------------------------------------------
-- 1. candidates table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidates (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name        TEXT NOT NULL,
  email            TEXT NOT NULL,
  phone            TEXT,
  job_title        TEXT NOT NULL,
  resume_url       TEXT,
  stage            TEXT NOT NULL DEFAULT 'Applied'
                   CHECK (stage IN ('Applied','Screening','Interview','Offer','Hired','Rejected')),
  application_date DATE NOT NULL DEFAULT CURRENT_DATE,
  interview_date   TIMESTAMPTZ,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, email)
);

-- -------------------------------------------------------
-- 2. candidate_stage_history table
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS candidate_stage_history (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id  UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_stage    TEXT,
  to_stage      TEXT NOT NULL,
  changed_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  note          TEXT
);

-- -------------------------------------------------------
-- 3. Indexes
-- -------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_candidates_user_id           ON candidates(user_id);
CREATE INDEX IF NOT EXISTS idx_candidates_stage             ON candidates(stage);
CREATE INDEX IF NOT EXISTS idx_candidates_application_date  ON candidates(application_date DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_updated_at        ON candidates(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_email             ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_fts               ON candidates USING gin(to_tsvector('english', full_name || ' ' || email || ' ' || job_title));
CREATE INDEX IF NOT EXISTS idx_stage_history_candidate      ON candidate_stage_history(candidate_id);
CREATE INDEX IF NOT EXISTS idx_stage_history_user           ON candidate_stage_history(user_id);

-- -------------------------------------------------------
-- 4. Auto-update updated_at trigger
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS candidates_updated_at ON candidates;
CREATE TRIGGER candidates_updated_at
  BEFORE UPDATE ON candidates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- -------------------------------------------------------
-- 5. Row Level Security (RLS)
-- -------------------------------------------------------
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_stage_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-runs
DROP POLICY IF EXISTS "Users select own candidates" ON candidates;
DROP POLICY IF EXISTS "Users insert own candidates" ON candidates;
DROP POLICY IF EXISTS "Users update own candidates" ON candidates;
DROP POLICY IF EXISTS "Users delete own candidates" ON candidates;

DROP POLICY IF EXISTS "Users select own stage history" ON candidate_stage_history;
DROP POLICY IF EXISTS "Users insert own stage history" ON candidate_stage_history;

-- candidates policies
CREATE POLICY "Users select own candidates"
  ON candidates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own candidates"
  ON candidates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own candidates"
  ON candidates FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own candidates"
  ON candidates FOR DELETE
  USING (auth.uid() = user_id);

-- stage history policies
CREATE POLICY "Users select own stage history"
  ON candidate_stage_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own stage history"
  ON candidate_stage_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
