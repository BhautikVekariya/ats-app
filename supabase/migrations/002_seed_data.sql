-- =============================================================
-- Migration 002: Sample Seed Data (20 fictional candidates)
-- Run AFTER migration 001 and AFTER creating your first user account.
-- Replace 'YOUR_USER_ID_HERE' with your actual auth.users UUID.
-- Find it in: Supabase Dashboard → Authentication → Users
-- =============================================================

-- Usage:
--   1. Sign up in the app (or via Supabase Auth dashboard)
--   2. Copy your user UUID from Authentication → Users
--   3. Replace all occurrences of 'YOUR_USER_ID_HERE' below
--   4. Run this SQL in Supabase SQL Editor

DO $$
DECLARE
  v_uid UUID := 'YOUR_USER_ID_HERE'; -- REPLACE THIS
  c1 UUID; c2 UUID; c3 UUID; c4 UUID; c5 UUID;
  c6 UUID; c7 UUID; c8 UUID; c9 UUID; c10 UUID;
  c11 UUID; c12 UUID; c13 UUID; c14 UUID; c15 UUID;
  c16 UUID; c17 UUID; c18 UUID; c19 UUID; c20 UUID;
BEGIN

INSERT INTO candidates (id, user_id, full_name, email, phone, job_title, stage, application_date, interview_date, notes)
VALUES
  (gen_random_uuid(), v_uid, 'Alice Thornton',   'alice.thornton@email.com',   '+1-555-0101', 'Senior Frontend Engineer',      'Interview',  '2024-09-15', '2024-10-20 10:00:00+00', 'Strong React skills, portfolio impressive.'),
  (gen_random_uuid(), v_uid, 'Benjamin Carter',  'ben.carter@email.com',        '+1-555-0102', 'Product Manager',               'Screening',  '2024-09-18', NULL,                     'Referred by Jane from Sales.'),
  (gen_random_uuid(), v_uid, 'Chloe Nakamura',   'chloe.nakamura@email.com',    '+1-555-0103', 'UX Designer',                   'Offer',      '2024-09-10', '2024-10-05 14:00:00+00', 'Excellent portfolio. Offer sent 10/10.'),
  (gen_random_uuid(), v_uid, 'David Kim',         'david.kim@email.com',         '+1-555-0104', 'Backend Engineer',              'Hired',      '2024-08-20', '2024-09-01 11:00:00+00', 'Started Nov 1. Exceptional Go experience.'),
  (gen_random_uuid(), v_uid, 'Elena Vasquez',     'elena.vasquez@email.com',     '+1-555-0105', 'Data Scientist',                'Rejected',   '2024-09-05', '2024-09-25 09:00:00+00', 'Good candidate, role filled internally.'),
  (gen_random_uuid(), v_uid, 'Frank Mueller',     'frank.mueller@email.com',     '+1-555-0106', 'DevOps Engineer',               'Applied',    '2024-10-01', NULL,                     NULL),
  (gen_random_uuid(), v_uid, 'Grace Li',          'grace.li@email.com',          '+1-555-0107', 'Full Stack Developer',          'Interview',  '2024-09-28', '2024-10-22 15:00:00+00', 'Second round interview scheduled.'),
  (gen_random_uuid(), v_uid, 'Henry Okafor',      'henry.okafor@email.com',      '+1-555-0108', 'Engineering Manager',           'Screening',  '2024-10-02', NULL,                     'Former lead at Stripe.'),
  (gen_random_uuid(), v_uid, 'Isabella Romano',   'isabella.romano@email.com',   '+1-555-0109', 'Marketing Manager',             'Applied',    '2024-10-05', NULL,                     NULL),
  (gen_random_uuid(), v_uid, 'James Patel',       'james.patel@email.com',       '+1-555-0110', 'iOS Developer',                 'Interview',  '2024-09-22', '2024-10-18 13:00:00+00', 'Technical test passed with flying colors.'),
  (gen_random_uuid(), v_uid, 'Karen Wilson',      'karen.wilson@email.com',      '+1-555-0111', 'QA Engineer',                   'Hired',      '2024-08-15', '2024-08-28 10:00:00+00', 'Joined team Sept 1. Automation specialist.'),
  (gen_random_uuid(), v_uid, 'Liam Nguyen',       'liam.nguyen@email.com',       '+1-555-0112', 'Cloud Architect',               'Offer',      '2024-09-30', '2024-10-12 11:00:00+00', 'Finalizing comp package.'),
  (gen_random_uuid(), v_uid, 'Mia Santos',        'mia.santos@email.com',        '+1-555-0113', 'Recruiter',                     'Rejected',   '2024-09-08', '2024-09-20 14:00:00+00', 'Overqualified for current role.'),
  (gen_random_uuid(), v_uid, 'Noah Anderson',     'noah.anderson@email.com',     '+1-555-0114', 'Security Engineer',             'Screening',  '2024-10-03', NULL,                     'Background check initiated.'),
  (gen_random_uuid(), v_uid, 'Olivia Martin',     'olivia.martin@email.com',     '+1-555-0115', 'Frontend Engineer',             'Applied',    '2024-10-07', NULL,                     NULL),
  (gen_random_uuid(), v_uid, 'Pedro Alvarez',     'pedro.alvarez@email.com',     '+1-555-0116', 'Machine Learning Engineer',     'Interview',  '2024-09-25', '2024-10-19 10:30:00+00', 'PhD from Stanford. Impressive papers.'),
  (gen_random_uuid(), v_uid, 'Quinn Johnson',     'quinn.johnson@email.com',     '+1-555-0117', 'Technical Writer',              'Screening',  '2024-10-04', NULL,                     'Writing sample under review.'),
  (gen_random_uuid(), v_uid, 'Rachel Brown',      'rachel.brown@email.com',      '+1-555-0118', 'Sales Engineer',                'Applied',    '2024-10-08', NULL,                     NULL),
  (gen_random_uuid(), v_uid, 'Samuel Thompson',   'samuel.thompson@email.com',   '+1-555-0119', 'Android Developer',             'Hired',      '2024-08-10', '2024-08-22 09:00:00+00', 'Strong Kotlin skills. Starting Oct 15.'),
  (gen_random_uuid(), v_uid, 'Tara Williams',     'tara.williams@email.com',     '+1-555-0120', 'Business Analyst',              'Rejected',   '2024-09-12', '2024-09-28 15:30:00+00', 'Cultural fit concerns raised by team.');

END $$;
