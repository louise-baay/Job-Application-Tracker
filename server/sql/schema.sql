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

-- Non-Functional traceability
CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  entity_type TEXT NOT NULL,      -- e.g. 'application'
  entity_id BIGINT NOT NULL,      -- applications.id
  action TEXT NOT NULL,           -- CREATE/UPDATE/DELETE/STATUS_CHANGE/SCHEDULE_INTERVIEW
  metadata_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(current_status);
CREATE INDEX IF NOT EXISTS idx_applications_company ON applications(company_name);
CREATE INDEX IF NOT EXISTS idx_applications_role ON applications(role_title);
CREATE INDEX IF NOT EXISTS idx_status_history_app ON status_history(application_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);