INSERT INTO applications (company_name, role_title, job_url, notes, salary_min, salary_max, current_status, date_applied)
VALUES
('Example Co', 'Software Developer Intern', 'https://example.com/job', 'Applied via referral', 20, 30, 'Applied', CURRENT_DATE);

INSERT INTO status_history (application_id, from_status, to_status, note)
VALUES
(1, NULL, 'Applied', 'Initial status');