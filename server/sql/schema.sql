-- Core tables for JobTracker

CREATE TABLE IF NOT EXISTS applications (
  id BIGSERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  job_url TEXT,
  notes TEXT,
  salary_min INTEGER,
  salary_max INTEGER,

  current_status TEXT NOT NULL,
  date_applied DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Optional interview scheduling fields
  interview_start TIMESTAMPTZ,
  interview_end TIMESTAMPTZ,
  calendar_event_id TEXT
);

CREATE TABLE IF NOT EXISTS status_history (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  from_status TEXT,
  to_status TEXT NOT NULL,
  note TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);